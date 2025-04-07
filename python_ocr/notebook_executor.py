import sys
import os
import json
import tempfile
import subprocess
import nbformat
from nbconvert.preprocessors import ExecutePreprocessor
from PIL import Image
import base64
import io
import traceback

class NotebookOCRExecutor:
    def __init__(self, notebook_path):
        """
        Initialize the executor with the path to the Jupyter notebook
        """
        self.notebook_path = notebook_path
        if not os.path.exists(notebook_path):
            raise FileNotFoundError(f"Notebook not found at {notebook_path}")
        
        # Load the notebook
        try:
            with open(notebook_path, 'r', encoding='utf-8') as f:
                self.notebook = nbformat.read(f, as_version=4)
        except Exception as e:
            raise ValueError(f"Failed to read notebook: {str(e)}")
            
        # Create executor
        self.executor = ExecutePreprocessor(timeout=600, kernel_name='python3')
    
    def process_image(self, image_path):
        """
        Process a single image using the notebook
        
        Args:
            image_path: Path to the image file
            
        Returns:
            dict: Results from the OCR processing
        """
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Image not found at {image_path}")
            
        try:
            # Create a temporary directory for execution
            with tempfile.TemporaryDirectory() as temp_dir:
                # Create a modified version of the notebook with the image path
                nb_copy = nbformat.from_dict(self.notebook.copy())
                
                # Insert the image path as a variable in the first cell (using absolute path)
                abs_image_path = os.path.abspath(image_path)
                image_cell = {
                    "cell_type": "code",
                    "execution_count": None,
                    "metadata": {},
                    "source": f"IMAGE_PATH = '{abs_image_path}'",
                    "outputs": []
                }
                nb_copy.cells.insert(0, nbformat.from_dict(image_cell))
                
                # Execute the notebook
                self.executor.preprocess(nb_copy, {'metadata': {'path': temp_dir}})
                
                # Extract results - assuming the last cell contains the OCR results
                # We'll look for a variable named 'ocr_results' in the outputs
                results = None
                for cell in reversed(nb_copy.cells):
                    if cell['cell_type'] == 'code' and len(cell.get('outputs', [])) > 0:
                        for output in cell['outputs']:
                            if output.get('name') == 'stdout':
                                try:
                                    # Try to parse JSON from stdout
                                    result_str = output.get('text', '')
                                    results = json.loads(result_str)
                                    if results:
                                        return results
                                except:
                                    pass
                            
                            # Try to look for data in 'data' field
                            if 'data' in output and 'text/plain' in output['data']:
                                text = output['data']['text/plain']
                                if "ocr_results" in text:
                                    # Try to extract the value
                                    try:
                                        # The text might be something like "ocr_results = {...}"
                                        if "=" in text:
                                            result_text = text.split("=", 1)[1].strip()
                                            results = eval(result_text)
                                            return results
                                    except:
                                        pass
                
                # If we couldn't find a structured result, return the text from the last output
                for cell in reversed(nb_copy.cells):
                    if cell['cell_type'] == 'code' and len(cell.get('outputs', [])) > 0:
                        for output in cell['outputs']:
                            if output.get('name') == 'stdout':
                                return {"extracted_text": output.get('text', '').strip()}
                
                return {"error": "No output found in notebook execution"}
        
        except Exception as e:
            traceback.print_exc()
            return {"error": str(e)}

def main():
    """
    CLI interface for testing
    """
    if len(sys.argv) < 3:
        print("Usage: python notebook_executor.py <notebook_path> <image_path>")
        sys.exit(1)
        
    notebook_path = sys.argv[1]
    image_path = sys.argv[2]
    
    try:
        executor = NotebookOCRExecutor(notebook_path)
        results = executor.process_image(image_path)
        print(json.dumps(results, ensure_ascii=False, indent=2))
    except Exception as e:
        traceback.print_exc()
        print(json.dumps({"error": str(e)}, ensure_ascii=False))
        sys.exit(1)

if __name__ == "__main__":
    main()