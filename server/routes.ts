import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDocumentSchema, processingResultSchema, images } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import { fromZodError } from "zod-validation-error";
import path from "path";
import fs from "fs";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { log } from "./vite";

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  log('Created uploads directory', 'app');
}

// Create notebooks directory if it doesn't exist
const notebooksDir = path.join(process.cwd(), 'notebooks');
if (!fs.existsSync(notebooksDir)) {
  fs.mkdirSync(notebooksDir, { recursive: true });
  log('Created notebooks directory', 'app');
}

// Set up multer for file storage
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// Set up multer for file uploads
const upload = multer({
  storage: diskStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files and PDFs
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG, GIF, and PDF files are allowed.'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  const apiRouter = app.route('/api');
  
  // Get all documents
  app.get('/api/documents', async (req: Request, res: Response) => {
    try {
      const documents = await storage.getAllDocuments();
      return res.status(200).json(documents);
    } catch (error) {
      console.error('Error fetching documents:', error);
      return res.status(500).json({ message: 'Failed to fetch documents' });
    }
  });

  // Get a specific document
  app.get('/api/documents/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid document ID' });
      }
      
      const document = await storage.getDocument(id);
      if (!document) {
        return res.status(404).json({ message: 'Document not found' });
      }
      
      return res.status(200).json(document);
    } catch (error) {
      console.error('Error fetching document:', error);
      return res.status(500).json({ message: 'Failed to fetch document' });
    }
  });

  // Upload a new image
  app.post('/api/images/upload', upload.single('file'), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      // Validate file type
      if (!req.file.mimetype.startsWith('image/')) {
        return res.status(400).json({ message: 'Only image files are allowed' });
      }

      // Get the file path instead of using buffer (which doesn't exist anymore)
      const filePath = req.file.path;
      let imageData;
      
      try {
        // Read the file and convert to base64
        const fileData = fs.readFileSync(filePath);
        imageData = fileData.toString('base64');
      } catch (err) {
        console.error('Error reading uploaded file:', err);
        return res.status(500).json({ message: 'Failed to process uploaded image' });
      }
      
      // Check if db is available
      if (!db) {
        return res.status(500).json({ 
          message: 'Database not available, using in-memory storage',
          fileName: req.file.originalname,
          filePath: filePath 
        });
      }
      
      const image = await db.insert(images).values({
        fileName: req.file.originalname,
        contentType: req.file.mimetype,
        fileSize: req.file.size,
        uploadDate: new Date().toISOString(),
        imageData: imageData,
        imageType: req.body.imageType || 'historical'
      }).returning();

      return res.status(201).json({
        id: image[0].id,
        fileName: image[0].fileName,
        contentType: image[0].contentType,
        imageType: image[0].imageType,
        url: `/api/images/${image[0].id}`
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      return res.status(500).json({ message: 'Failed to upload image' });
    }
  });

// Get image by id
  app.get('/api/images/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (!db) {
        return res.status(500).json({ message: 'Database not available, using in-memory storage' });
      }
      
      const result = await db.select().from(images).where(eq(images.id, id));
      
      if (result.length === 0) {
        return res.status(404).json({ message: 'Image not found' });
      }

      const image = result[0];
      return res.status(200).json(image);
    } catch (error) {
      console.error('Error fetching image:', error);
      return res.status(500).json({ message: 'Failed to fetch image' });
    }
  });

// Upload a new document
  app.post('/api/documents/upload', upload.single('file'), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      // Get the file path of the saved file
      const filePath = req.file.path;
      
      const parsedData = insertDocumentSchema.parse({
        fileName: req.file.originalname,
        contentType: req.file.mimetype,
        fileSize: req.file.size,
        uploadDate: new Date().toISOString(),
        filePath: filePath,
        status: 'uploaded',
        enhancementEnabled: req.body.enhancementEnabled === 'true',
        spellCheckEnabled: req.body.spellCheckEnabled === 'true',
        layoutAnalysisEnabled: req.body.layoutAnalysisEnabled === 'true',
        ocrMode: req.body.ocrMode || 'auto',
        outputFormat: req.body.outputFormat || 'txt',
        confidenceThreshold: parseInt(req.body.confidenceThreshold || '80')
      });

      const document = await storage.createDocument(parsedData);
      
      log(`Document uploaded and saved at: ${filePath}`, 'app');
      
      return res.status(201).json(document);
    } catch (error) {
      console.error('Error uploading document:', error);
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      return res.status(500).json({ message: 'Failed to upload document' });
    }
  });

  // Process a document
  app.post('/api/documents/:id/process', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid document ID' });
      }
      
      const document = await storage.getDocument(id);
      if (!document) {
        return res.status(404).json({ message: 'Document not found' });
      }
      
      // Perform OCR processing on the document
      const result = await storage.processDocument(id);
      if (!result) {
        return res.status(500).json({ message: 'Failed to process document' });
      }
      
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error processing document:', error);
      return res.status(500).json({ message: 'Failed to process document' });
    }
  });

  // Update a document
  app.patch('/api/documents/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid document ID' });
      }
      
      const document = await storage.getDocument(id);
      if (!document) {
        return res.status(404).json({ message: 'Document not found' });
      }
      
      const updatedDocument = await storage.updateDocument(id, req.body);
      return res.status(200).json(updatedDocument);
    } catch (error) {
      console.error('Error updating document:', error);
      return res.status(500).json({ message: 'Failed to update document' });
    }
  });

  // Delete a document
  app.delete('/api/documents/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid document ID' });
      }
      
      const success = await storage.deleteDocument(id);
      if (!success) {
        return res.status(404).json({ message: 'Document not found' });
      }
      
      return res.status(204).send();
    } catch (error) {
      console.error('Error deleting document:', error);
      return res.status(500).json({ message: 'Failed to delete document' });
    }
  });

  // Upload a notebook file for OCR
  app.post('/api/notebook/upload', upload.single('file'), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      // Check file type - should be .ipynb
      if (!req.file.originalname.endsWith('.ipynb')) {
        return res.status(400).json({ message: 'Invalid file type. Only Jupyter notebook (.ipynb) files are allowed.' });
      }

      // Get the path to the uploaded file
      const sourcePath = req.file.path;
      
      // Create a destination path in the notebooks directory
      const destPath = path.join(notebooksDir, 'ocr_notebook.ipynb');
      
      // Copy the file to the notebooks directory
      fs.copyFileSync(sourcePath, destPath);
      
      // Update OCR module to use the new notebook
      const { setNotebookPath } = await import('./ocr');
      setNotebookPath(destPath);
      
      log(`Notebook uploaded and saved at: ${destPath}`, 'app');
      
      return res.status(200).json({
        success: true,
        message: 'Notebook uploaded and installed successfully',
        path: destPath
      });
    } catch (error) {
      console.error('Error uploading notebook:', error);
      return res.status(500).json({ message: 'Failed to upload notebook' });
    }
  });
  
  // Submit contact form
  app.post('/api/contact', async (req: Request, res: Response) => {
    try {
      const contactSchema = z.object({
        name: z.string().min(2, "Name is required"),
        email: z.string().email("Invalid email address"),
        subject: z.string().min(2, "Subject is required"),
        message: z.string().min(10, "Message is too short"),
        consent: z.boolean().refine(val => val === true, {
          message: "You must consent to the processing of your data"
        })
      });

      const validData = contactSchema.parse(req.body);
      
      // In a real application, you'd save this to a database or send an email
      // For this example, we'll just return success
      
      return res.status(200).json({ 
        success: true, 
        message: "Thank you for your message. We'll get back to you soon!"
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      return res.status(500).json({ message: 'Failed to submit contact form' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
