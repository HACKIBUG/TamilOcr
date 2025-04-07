import json
import os

# Path to the notebook
notebook_path = "notebooks/sample_ocr.ipynb"

# Load the notebook
with open(notebook_path, 'r') as f:
    notebook = json.load(f)

# Find the cell with the execution code
for cell in notebook['cells']:
    if cell['cell_type'] == 'code' and any('if \'IMAGE_PATH\' in globals() and os.path.exists(IMAGE_PATH):' in line for line in cell.get('source', [])):
        # Insert debugging lines
        new_source = []
        for line in cell['source']:
            new_source.append(line)
            if 'Debug: IMAGE_PATH' in line:
                new_source.append('# Check if file exists\n')
                new_source.append('print(f"Checking if file exists: {os.path.abspath(IMAGE_PATH) if \'IMAGE_PATH\' in globals() else \'not defined\'}")\n')
                new_source.append('print(f"Current working directory: {os.getcwd()}")\n')
                new_source.append('print(f"File exists: {os.path.exists(IMAGE_PATH) if \'IMAGE_PATH\' in globals() else False}")\n')
        
        cell['source'] = new_source
        
        # Also fix the path handling
        for i, line in enumerate(cell['source']):
            if 'if \'IMAGE_PATH\' in globals() and os.path.exists(IMAGE_PATH):' in line:
                # Replace with absolute path conversion
                cell['source'][i] = 'if \'IMAGE_PATH\' in globals():\n'
                new_index = i + 1
                cell['source'].insert(new_index, '    # Convert to absolute path if it\'s not already\n')
                cell['source'].insert(new_index + 1, '    abs_path = os.path.abspath(IMAGE_PATH)\n')
                cell['source'].insert(new_index + 2, '    if os.path.exists(abs_path):\n')
        break

# Save the modified notebook
with open(notebook_path, 'w') as f:
    json.dump(notebook, f, indent=1)

print(f"Updated {notebook_path}")