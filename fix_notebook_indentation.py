import json
import os

# Path to the notebook
notebook_path = "notebooks/sample_ocr.ipynb"

# Load the notebook
with open(notebook_path, 'r') as f:
    notebook = json.load(f)

# Find the cell with the execution code
for cell in notebook['cells']:
    if cell['cell_type'] == 'code' and any('if \'IMAGE_PATH\' in globals()' in line for line in cell.get('source', [])):
        # Create a corrected version of the source with proper indentation
        source_text = ''.join(cell['source'])
        
        # Replace the problematic part with correctly indented code
        corrected_text = """print(f"Debug: IMAGE_PATH = {IMAGE_PATH if 'IMAGE_PATH' in globals() else 'not defined'}")
# Check if file exists
print(f"Checking if file exists: {os.path.abspath(IMAGE_PATH) if 'IMAGE_PATH' in globals() else 'not defined'}")
print(f"Current working directory: {os.getcwd()}")
print(f"File exists: {os.path.exists(IMAGE_PATH) if 'IMAGE_PATH' in globals() else False}")
# Check if the image exists
if 'IMAGE_PATH' in globals():
    # Convert to absolute path if it's not already
    abs_path = os.path.abspath(IMAGE_PATH)
    if os.path.exists(abs_path):
        # Preprocess the image
        processed_img, preprocess_error = preprocess_image(IMAGE_PATH)
        
        if preprocess_error:
            ocr_results = {
                "error": f"Preprocessing error: {preprocess_error}",
                "extracted_text": "",
                "confidence": 0
            }
        else:
            # Perform OCR
            extracted_text, ocr_error = perform_ocr(processed_img)
            
            # If Tamil OCR is not available, use the warning text from the OCR function
            ocr_results = {
                "extracted_text": extracted_text,
                "confidence": 85 if not ocr_error else 60,
                "warning": ocr_error if ocr_error else None
            }
    else:
        ocr_results = {
            "error": f"Image not found: {abs_path}",
            "extracted_text": "",
            "confidence": 0
        }
else:
    ocr_results = {
        "error": f"Image not found: {'IMAGE_PATH' if 'IMAGE_PATH' in globals() else 'No image path specified'}",
        "extracted_text": "",
        "confidence": 0
    }

# Output the results as JSON
print(json.dumps(ocr_results, ensure_ascii=False))"""
        
        # Replace the cell source with the corrected version
        cell['source'] = [corrected_text]
        break

# Save the modified notebook
with open(notebook_path, 'w') as f:
    json.dump(notebook, f, indent=1)

print(f"Updated {notebook_path} with fixed indentation")