from PIL import Image

def create_placeholder_icon(size, color, filename):
    img = Image.new('RGB', (size, size), color = color)
    img.save(filename)

create_placeholder_icon(16, 'blue', 'icons/icon16.png')
create_placeholder_icon(48, 'blue', 'icons/icon48.png')
create_placeholder_icon(128, 'blue', 'icons/icon128.png')
