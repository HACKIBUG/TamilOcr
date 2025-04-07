import { ProcessingResult } from '@shared/schema';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import { log } from './vite';

const execPromise = promisify(exec);

// Path to the user's Jupyter notebook file
// This can be changed to the actual path where the user uploads their notebook
let notebookPath = path.join(process.cwd(), 'ocr_notebook.ipynb');

// Function to process an image using the Python OCR
export async function processImageWithOCR(imagePath: string): Promise<ProcessingResult | { error: string }> {
  if (!fs.existsSync(imagePath)) {
    return { error: `Image file not found at ${imagePath}` };
  }

  // Check if notebook exists, if not return an error message asking to upload it
  if (!fs.existsSync(notebookPath)) {
    return { 
      error: `OCR notebook not found at ${notebookPath}. Please upload your Jupyter notebook.` 
    };
  }

  try {
    // Start timing for the processing
    const startTime = Date.now();
    
    // Execute the Python script
    const pythonPath = 'python3'; // or 'python' depending on your setup
    const scriptPath = path.join(process.cwd(), 'python_ocr/ocr_wrapper.py');
    
    log(`Executing OCR script with notebook: ${notebookPath} and image: ${imagePath}`, "ocr");
    
    const command = `${pythonPath} ${scriptPath} "${notebookPath}" "${imagePath}"`;
    const { stdout, stderr } = await execPromise(command);
    
    if (stderr) {
      log(`OCR process stderr: ${stderr}`, "ocr");
    }
    
    // Calculate the total processing time
    const totalTimeMs = Date.now() - startTime;
    
    // Parse the JSON output from the Python script
    let result;
    try {
      result = JSON.parse(stdout);
    } catch (e: any) {
      log(`Failed to parse OCR result as JSON: ${stdout}`, "ocr");
      throw new Error(`Failed to parse OCR result: ${e.message}`);
    }
    
    // Check if the result contains an error
    if (result.error) {
      throw new Error(result.error);
    }
    
    // Create the stages data with statuses from the schema
    const stages = [
      {
        name: "Image Enhancement",
        status: "completed" as "completed" | "failed" | "in_progress" | "pending",
        progress: 100,
        timeMs: Math.floor(totalTimeMs * 0.3), // Allocate 30% of the time to image enhancement
      },
      {
        name: "Text Recognition",
        status: "completed" as "completed" | "failed" | "in_progress" | "pending",
        progress: 100,
        timeMs: Math.floor(totalTimeMs * 0.5), // Allocate 50% of the time to text recognition
      },
      {
        name: "Post-processing",
        status: "completed" as "completed" | "failed" | "in_progress" | "pending",
        progress: 100,
        timeMs: Math.floor(totalTimeMs * 0.2), // Allocate 20% of the time to post-processing
      },
    ];
    
    // Extract the text from the result (assuming the result has a field like 'extracted_text')
    const extractedText = result.extracted_text || result.text || '';
    
    // Create the final result object
    const processingResult: ProcessingResult = {
      documentId: 0, // This will be updated by the caller
      extractedText,
      confidence: result.confidence || 90, // Default to 90% if not provided
      processingTime: totalTimeMs,
      charCount: extractedText.length,
      stages,
    };
    
    return processingResult;
  } catch (error: any) {
    log(`Error processing image with OCR: ${error.message || String(error)}`, "ocr");
    return { error: error.message || String(error) };
  }
}

// Function to set a new notebook path (for when user uploads a new notebook)
export function setNotebookPath(path: string): void {
  notebookPath = path;
}

// Function to get the current notebook path
export function getNotebookPath(): string {
  return notebookPath;
}