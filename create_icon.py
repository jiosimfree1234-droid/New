from PIL import Image, ImageDraw

# Create a new image with a transparent background
img = Image.new('RGBA', (128, 128), (0, 0, 0, 0))

# Get a drawing context
draw = ImageDraw.Draw(img)

# Draw a green rectangle
draw.rectangle([(10, 10), (118, 118)], fill='#4CAF50')

# Save the image
img.save('icons/icon128.png', 'PNG')
