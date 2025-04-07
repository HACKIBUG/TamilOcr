from PIL import Image, ImageDraw, ImageFont
import numpy as np
import os

# Create directory for test images if it doesn't exist
test_dir = 'uploads'
if not os.path.exists(test_dir):
    os.makedirs(test_dir)

# Create a blank image with white background
width, height = 800, 400
image = Image.new('RGB', (width, height), color='white')
draw = ImageDraw.Draw(image)

# Try to use a font if available, otherwise use default
try:
    # Try to find a system font that supports Tamil
    font_path = "/usr/share/fonts/truetype/freefont/FreeSans.ttf"  # Typical path on Linux
    if os.path.exists(font_path):
        font = ImageFont.truetype(font_path, 40)
    else:
        font = ImageFont.load_default()
except Exception as e:
    print(f"Error loading font: {e}")
    font = ImageFont.load_default()

# Tamil text to render
tamil_text = "தமிழ் மொழி"

# Center the text in the image
text_width, text_height = draw.textbbox((0, 0), tamil_text, font=font)[2:4]
x = (width - text_width) // 2
y = (height - text_height) // 2

# Draw the text in black
draw.text((x, y), tamil_text, fill='black', font=font)

# Save the image
output_path = os.path.join(test_dir, 'test_tamil.png')
image.save(output_path)

print(f"Created test image at: {output_path}")

# Also create a simple English text image as fallback
image2 = Image.new('RGB', (width, height), color='white')
draw2 = ImageDraw.Draw(image2)
english_text = "Tamil OCR Test"
text_width, text_height = draw2.textbbox((0, 0), english_text, font=font)[2:4]
x = (width - text_width) // 2
y = (height - text_height) // 2
draw2.text((x, y), english_text, fill='black', font=font)
output_path2 = os.path.join(test_dir, 'test_english.png')
image2.save(output_path2)

print(f"Created fallback test image at: {output_path2}")