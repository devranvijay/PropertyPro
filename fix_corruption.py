import os
import re

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix corrupted template literals ?{ -> ${
    content = content.replace('?{', '${')
    
    # Fix corrupted currency symbols in specific contexts
    # If ? is followed by a number, it's likely INR
    content = re.sub(r'\?(\d)', r'₹\1', content)
    
    # Special cases for labels like Price (?)
    content = content.replace('Price (?)', 'Price (₹)')
    content = content.replace('Under ?', 'Under ₹')
    content = content.replace(' - ?', ' - ₹')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

pages_dir = r'c:\Users\singh\Downloads\PropertyPro\frontend\src\pages'
for root, dirs, files in os.walk(pages_dir):
    for file in files:
        if file.endswith('.tsx'):
            fix_file(os.path.join(root, file))

components_dir = r'c:\Users\singh\Downloads\PropertyPro\frontend\src\components'
for root, dirs, files in os.walk(components_dir):
    for file in files:
        if file.endswith('.tsx'):
            fix_file(os.path.join(root, file))
