import fitz  # PyMuPDF
import os
import re
import json
from collections import defaultdict

# Set paths
pdf_path = "/mnt/data/IOF Control Descriptions 2024.pdf"
output_dir = "/mnt/data/extracted_images"
json_path = "/mnt/data/symbols_up_to_column_G_empty_descriptions.json"
os.makedirs(output_dir, exist_ok=True)

# Max page to parse
max_page = 17

# Checklist types for Column D
checklist_structure = {
    "Column C": "Clarification",
    "Column D": {
        "Landforms": [1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 1.10, 1.11, 1.12, 1.13, 1.14, 1.15, 1.16],
        "Rock and Boulders": [2.1, 2.2, 2.3, 2.4, 2.5, 2.6],
        "Water Features": [3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10, 3.11],
        "Vegetation": [4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 4.10],
        "Man-made Features": [5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 5.10, 5.11, 5.12, 5.13, 5.14, 5.15,
                              5.16, 5.17, 5.18, 5.19, 5.20, 5.21, 5.22, 5.23, 5.24],
        "Prominent / Special": [6.1, 6.2]
    },
    "Column E": "Appearance",
    "Column F": "Dimensions",
    "Column G": "Location"
}

def get_column_and_type(ref_num):
    try:
        major = int(ref_num.split('.')[0])
    except:
        return "Unknown", ""

    column_map = {
        0: "Column C", 1: "Column D", 2: "Column D", 3: "Column D",
        4: "Column D", 5: "Column D", 6: "Column D", 7: "Column D",
        8: "Column E", 9: "Column F", 10: "Column F", 11: "Column F",
        12: "Column G", 13: "Column H"
    }
    column = column_map.get(major, "Unknown")
    type_label = ""

    if column == "Column D":
        for typ, refs in checklist_structure["Column D"].items():
            if round(float(ref_num), 2) in refs:
                type_label = typ
                break
    elif column in checklist_structure:
        type_label = checklist_structure[column]

    return column, type_label

def safe_filename_part(text):
    return text.strip().replace('/', '-').replace(' ', '_').replace(':', '-')

# Start PDF processing
doc = fitz.open(pdf_path)
image_paths = []
symbol_entries = []

for page_number in range(max_page):
    page = doc[page_number]
    image_list = page.get_images(full=True)
    page_text = page.get_text()
    ref_matches = re.findall(r'(\d+\.\d+)\s+([\w /()\-]+)', page_text)

    for img_index, img in enumerate(image_list, start=1):
        xref = img[0]
        base_image = doc.extract_image(xref)
        image_bytes = base_image["image"]
        image_ext = base_image["ext"]

        if img_index - 1 < len(ref_matches):
            ref, name = ref_matches[img_index - 1]
            column, type_label = get_column_and_type(ref)
            filename = f"{safe_filename_part(column)} - {safe_filename_part(type_label)} - {ref} - {safe_filename_part(name)}.{image_ext}"
        else:
            filename = f"page{page_number+1}_img{img_index}.{image_ext}"
            ref, name, column, type_label = "unknown", filename, "unknown", ""

        image_path = os.path.join(output_dir, filename)
        with open(image_path, "wb") as image_file:
            image_file.write(image_bytes)

        symbol_entries.append({
            "ref": ref,
            "name": name.replace('_', ' ').strip(),
            "column": column.replace('_', ' ').strip(),
            "type": type_label.replace('_', ' ').strip(),
            "image": f"./assets/{filename}",
            "description": ""  # Empty for manual fill later
        })

# Filter to Column C to G
filtered_entries = [entry for entry in symbol_entries if entry["column"] in {
    "Column C", "Column D", "Column E", "Column F", "Column G"
}]

# Export JSON
with open(json_path, "w", encoding="utf-8") as f:
    json.dump(filtered_entries, f, indent=2)
