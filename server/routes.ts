import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDocumentSchema, processingResultSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import { fromZodError } from "zod-validation-error";
import path from "path";
import fs from "fs";

// Set up multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
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

  // Upload a new document
  app.post('/api/documents/upload', upload.single('file'), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const parsedData = insertDocumentSchema.parse({
        fileName: req.file.originalname,
        contentType: req.file.mimetype,
        fileSize: req.file.size,
        uploadDate: new Date().toISOString(),
        status: 'uploaded',
        enhancementEnabled: req.body.enhancementEnabled === 'true',
        spellCheckEnabled: req.body.spellCheckEnabled === 'true',
        layoutAnalysisEnabled: req.body.layoutAnalysisEnabled === 'true',
        ocrMode: req.body.ocrMode || 'auto',
        outputFormat: req.body.outputFormat || 'txt',
        confidenceThreshold: parseInt(req.body.confidenceThreshold || '80')
      });

      const document = await storage.createDocument(parsedData);
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
