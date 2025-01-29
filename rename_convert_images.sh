#!/bin/bash

# Directory containing images
IMAGE_DIR="background_images"

# Ensure directory exists
if [ ! -d "$IMAGE_DIR" ]; then
    echo "Error: Directory $IMAGE_DIR not found!"
    exit 1
fi

# Create output directory if needed
OUTPUT_DIR="converted_images"
mkdir -p "$OUTPUT_DIR"

# Counter for naming
count=1

# Iterate over files in directory
for file in "$IMAGE_DIR"/*; do
    # Get file extension (lowercase)
    ext="${file##*.}"
    ext_lower=$(echo "$ext" | tr '[:upper:]' '[:lower:]')

    # Define new file name
    new_name="$OUTPUT_DIR/photo${count}.jpg"

    # Convert HEIC to JPG
    if [[ "$ext_lower" == "heic" ]]; then
        echo "Converting $file to $new_name"
        magick convert "$file" "$new_name"
    elif [[ "$ext_lower" == "jpg" || "$ext_lower" == "jpeg" ]]; then
        # Just rename JPG files
        echo "Renaming $file to $new_name"
        cp "$file" "$new_name"
    else
        echo "Skipping $file (unsupported format)"
        continue
    fi

    # Increment counter
    ((count++))
done

echo "Conversion complete. Images saved to $OUTPUT_DIR"

