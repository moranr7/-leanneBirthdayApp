#!/usr/bin/env python3

import requests
from bs4 import BeautifulSoup
import json
import os

# Define constants
URL = "https://www.bestchildfriendlyholidays.co.uk/best-family-sunshine-holidays-with-heated-swimming-pools/"
DOWNLOAD_DIR = "hotel_images"
JSON_FILE = "hotels.json"
HOTELS_HTML = "hotels.html"

# Ensure the directory exists
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

# Fetch the webpage
response = requests.get(URL)
soup = BeautifulSoup(response.text, "html.parser")

hotels = []
html_content = []

# Find hotel sections
for hotel_section in soup.find_all("table", class_="bcfhtable"):
    name_tag = hotel_section.find("h2")
    if not name_tag:
        continue
    name = name_tag.text.strip()
    
    # Extract the actual resort or TripAdvisor link if available
    link_tag = hotel_section.find("a", href=True)
    hotel_link = link_tag["href"] if link_tag else f"https://www.bestchildfriendlyholidays.co.uk/#{'-'.join(name.lower().split())}"
    
    # Extract image URLs
    images = hotel_section.find_all("img")
    image_paths = []
    
    for img in images[:3]:  # Limit to 3 images per hotel
        img_url = img.get("src")
        if img_url.startswith("./"):
            img_url = URL.rsplit("/", 1)[0] + img_url[1:]
        
        img_name = os.path.join(DOWNLOAD_DIR, os.path.basename(img_url))
        img_data = requests.get(img_url).content
        with open(img_name, "wb") as img_file:
            img_file.write(img_data)
        image_paths.append(img_name)
    
    # Extract hotel features
    features_list = hotel_section.find_all("ul", class_="fav")
    features = [li.text.strip() for ul in features_list for li in ul.find_all("li")]
    
    # Extract rating
    rating = len(hotel_section.find_all("img", alt=lambda alt: alt and "Trip Advisor" in alt))
    
    # Extract reviews
    review_tag = hotel_section.find("p", class_="quotetext")
    reviews = [review_tag.text.strip()] if review_tag else []
    
    # Store data
    hotel = {
        "name": name,
        "link": hotel_link,
        "images": image_paths,
        "features": features,
        "rating": rating,
        "reviews": reviews
    }
    hotels.append(hotel)
    
    # Generate HTML
    html_content.append(f"""
        <div class='bg-white rounded-xl shadow-lg overflow-hidden p-6'>
            <h3 class='text-2xl font-bold text-gray-800 mb-4'><a href='{hotel_link}' target='_blank' rel='noopener noreferrer'>{name}</a></h3>
            <div class='aspect-video mb-6'>
                <img src='{image_paths[0]}' alt='{name}' class='w-full h-full object-cover rounded-lg'>
            </div>
            <ul class='space-y-2'>
                {''.join(f"<li class='flex items-start gap-2'><span class='text-purple-600'>★</span> {feat}</li>" for feat in features[:5])}
            </ul>
            <button onclick="selectHotel('{name}')" class='mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full'>
                Choose This Hotel
            </button>
        </div>
    """)

# Save JSON file
with open(JSON_FILE, "w") as json_file:
    json.dump(hotels, json_file, indent=4)

# Save HTML file
with open(HOTELS_HTML, "w") as html_file:
    html_file.write("\n".join(html_content))

print(f"Hotels and images downloaded. JSON saved to {JSON_FILE}, HTML saved to {HOTELS_HTML}.")
