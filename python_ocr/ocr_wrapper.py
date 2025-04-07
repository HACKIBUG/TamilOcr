#!/usr/bin/env python3
"""
Wrapper script for executing OCR on an image using a Jupyter notebook
This script is intended to be called from Node.js
"""

import sys
import os
import json
import traceback

# Fix import path issue
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from python_ocr.notebook_executor import NotebookOCRExecutor
from python_ocr.simple_ocr import process_image as simple_process_image

def process_image(notebook_path, image_path):
    """
    Process a single image using the notebook
    Returns a JSON string with the results
    """
    try:
        # First attempt: Try with notebook executor
        try:
            executor = NotebookOCRExecutor(notebook_path)
            results = executor.process_image(image_path)
            if "error" not in results or not results["error"]:
                return json.dumps(results, ensure_ascii=False)
            else:
                print(f"Notebook execution had errors: {results.get('error')}, falling back to simple OCR")
        except Exception as notebook_error:
            traceback.print_exc()
            print(f"Notebook execution failed: {str(notebook_error)}, falling back to simple OCR")
            
        # Fallback: Use simple OCR directly
        print(f"Using fallback OCR method for {image_path}")
        return simple_process_image(image_path)
    except Exception as e:
        traceback.print_exc()
        return json.dumps({"error": str(e)}, ensure_ascii=False)

if __name__ == "__main__":
    # Command-line interface
    # Expects exactly two arguments: notebook_path and image_path
    if len(sys.argv) != 3:
        print(json.dumps({"error": "Usage: python ocr_wrapper.py <notebook_path> <image_path>"}, 
                         ensure_ascii=False))
        sys.exit(1)
    
    notebook_path = sys.argv[1]
    image_path = sys.argv[2]
    
    if not os.path.exists(notebook_path):
        print(json.dumps({"error": f"Notebook not found: {notebook_path}"}, ensure_ascii=False))
        sys.exit(1)
    
    if not os.path.exists(image_path):
        print(json.dumps({"error": f"Image not found: {image_path}"}, ensure_ascii=False))
        sys.exit(1)
    
    result = process_image(notebook_path, image_path)
    print(result)