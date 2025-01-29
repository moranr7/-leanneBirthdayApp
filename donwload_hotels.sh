#!/bin/bash

# Set the output directory for images
download_dir="hotel_images"
mkdir -p "$download_dir"

# Download the HTML page
html_file="hotels.html"
curl -sL "https://www.bestchildfriendlyholidays.co.uk/best-family-sunshine-holidays-with-heated-swimming-pools/" -o "$html_file"

# Extract hotel names, image URLs, and relevant data
json_file="hotels.json"
echo "[" > "$json_file"

# Parse the HTML and extract hotels
grep -oP '<h2 style="color:#fffbff">\s*(.*?)\s*</h2>' "$html_file" | sed 's/<[^>]*>//g' | while read -r hotel_name; do
    echo "Processing: $hotel_name"

    # Find the first large image URL
    image_url=$(grep -oP '(?<=src=")[^"]+\.jpg' "$html_file" | head -n 1)
    
    # Extract last part of the URL for filename
    image_name=$(basename "$image_url")
    image_path="$download_dir/$image_name"
    
    # Download image
    curl -s "$image_url" -o "$image_path"
    
    # Append data to JSON file
    echo "  {" >> "$json_file"
    echo "    \"name\": \"$hotel_name\"," >> "$json_file"
    echo "    \"image\": \"$image_path\"" >> "$json_file"
    echo "  }," >> "$json_file"

done

# Remove the last comma and close the JSON array
sed -i '' -e '$ s/,$//' "$json_file"
echo "]" >> "$json_file"

echo "Hotels and images downloaded. JSON saved to $json_file."

