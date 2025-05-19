#!/usr/bin/env python3
"""
Simple OCR module that can be used as a fallback when notebook execution fails
"""

import os
import sys
import json
import traceback
import pytesseract

# Point to tesseract binary
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# Set the environment variable correctly
os.environ['TESSDATA_PREFIX'] = r"C:\Program Files\Tesseract-OCR\tessdata"

from PIL import Image
import cv2
import numpy as np

def preprocess_image(image_path):
    """
    Preprocess the image for better OCR results
    """
    try:
        # Read the image
        img = cv2.imread(image_path)
        
        # Check if image was loaded correctly
        if img is None:
            # Fallback to PIL if OpenCV fails
            pil_img = Image.open(image_path)
            img = np.array(pil_img)
            # Convert RGB to BGR (OpenCV format)
            if len(img.shape) == 3 and img.shape[2] == 3:
                img = img[:, :, ::-1].copy()
                
        # Convert to grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Apply thresholding to handle shadows and variations in lighting
        thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)[1]
        
        # Perform morphological operations to remove noise
        kernel = np.ones((1, 1), np.uint8)
        opening = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel, iterations=1)
        
        # Invert back
        result = cv2.bitwise_not(opening)
        
        return result, None
    except Exception as e:
        traceback.print_exc()
        return None, str(e)

def perform_ocr(image, lang='tam'):
    """
    Run OCR on the preprocessed image
    """
    try:
        # Use Tamil language model
        text = pytesseract.image_to_string(image, lang=lang)
        return text, None
    except Exception as e:
        # Fall back to English if Tamil isn't available
        try:
            text = pytesseract.image_to_string(image)
            return text + "\n(Note: Processed using English OCR due to missing Tamil language pack)", str(e)
        except Exception as e2:
            traceback.print_exc()
            return "", f"OCR Error: {str(e2)}"

def process_image(image_path):
    """
    Process a single image using OCR
    Returns a JSON string with the results
    """
    try:
        # Check if the image exists
        if not os.path.exists(image_path):
            return json.dumps({
                "error": f"Image not found: {image_path}",
                "extracted_text": "",
                "confidence": 0
            }, ensure_ascii=False)
            
        # Preprocess the image
        processed_img, preprocess_error = preprocess_image(image_path)
        
        if preprocess_error:
            return json.dumps({
                "error": f"Preprocessing error: {preprocess_error}",
                "extracted_text": "",
                "confidence": 0
            }, ensure_ascii=False)
            
        # Perform OCR
        extracted_text, ocr_error = perform_ocr(processed_img)
        
        # Create the result
        result = {
            "extracted_text": extracted_text,
            "confidence": 85 if not ocr_error else 60
        }
        
        if ocr_error:
            result["warning"] = ocr_error
            
        return json.dumps(result, ensure_ascii=False)
    except Exception as e:
        traceback.print_exc()
        return json.dumps({
            "error": str(e),
            "extracted_text": "",
            "confidence": 0
        }, ensure_ascii=False)

if __name__ == "__main__":
    # Command-line interface
    # Expects exactly one argument: image_path
    if len(sys.argv) != 2:
        print(json.dumps({
            "error": "Usage: python simple_ocr.py <image_path>"
        }, ensure_ascii=False))
        sys.exit(1)
    
    image_path = sys.argv[1]
    result = process_image(image_path)
    print(result)