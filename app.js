let giftChoices = {
    type: null,
    hotel: null,
    date: null,
    attendees: ['leanne', 'ray'] // Default attendees
};

const hotels = [
    {
        id: 'mediterraneo',
        name: 'Mediterraneo Bay Hotel and Resort',
        location: 'Costa Del Almeria, Spain',
        video: 'assets/mediterraneo.mp4',
        features: [
            'Moments from the Beach',
            'In a quiet area of the resort',
            'A short stroll from the hustle and bustle',
            'Short airport transfer',
            'Amazing Aqua Park and Splash Park',
            'An array of bars and restaurants',
            'Two restaurants have high chairs and a kids\' buffet',
            'Mini Disco'
        ],
        additionalFeatures: [
            'Giant lagoon style pool',
            'Indoor pool',
            'Short airport transfer',
            'Great range of sports, leisure and entertainment',
            'Kids\' club from 4 years old',
            'Cots available',
            'Onsite Minimart',
            'Your under 2s Stay Free'
        ],
        images: {
            main: 'assets/mediterraneo-main.jpg',
            additional: ['assets/mediterraneo-1.jpg', 'assets/mediterraneo-2.jpg']
        },
        rating: 4,
        reviews: ['Excellent Facilities, Excellent Value', 'Fantastic Family Holiday']
    },
    {
        id: 'myramar',
        name: 'Myramar Fuengirola Family Apartments',
        location: 'Costa Del Sol, Spain',
        video: 'assets/myramar.mp4',
        features: [
            '1 and 2 bedroom apartments sleep up to 6',
            'Self Catering / B+B / Half Board options',
            'Heated indoor pool',
            'Outdoor pool with children\'s section',
            'Kids\' club (4-12 years)',
            'Evening entertainment',
            'Close to beach'
        ],
        additionalFeatures: [
            'Buffet restaurant',
            'Pool bar',
            'Children\'s playground',
            'Mini market',
            'Free WiFi zones',
            'Air conditioning',
            'Central location'
        ],
        images: {
            main: 'assets/myramar-main.jpg',
            additional: ['assets/myramar-1.jpg', 'assets/myramar-2.jpg']
        },
        rating: 4,
        reviews: ['Great Family Holiday', 'Perfect Location']
    },
    {
        id: 'holiday-village',
        name: 'TUI BLUE Holiday Village',
        location: 'Turkey',
        video: 'assets/holiday-village.mp4',
        features: [
            'Gorgeous family rooms with sliding partition sleep up to 4',
            'Short Transfer Time',
            'Direct access to a fabulous beach',
            'Parent and Toddler Sessions',
            'Baby Club from 0 months plus',
            'Seven glorious pools and tiny tots get their own area',
            'Heated Indoor Pool'
        ],
        additionalFeatures: [
            'Fantastic kids\' club from 3 years old',
            'Baby Friendly Essentials Covered including cots, buggies, sterilisers and more',
            'Swim, football and theatre academies',
            'Onsite Bowling Alley!',
            'Raft building and canoeing',
            'Brilliant Spa and jacuzzi facilities available for the grown-ups',
            'All inclusive of food, drinks, activities',
            'Your little ones under two travel for free'
        ],
        images: {
            main: 'assets/holiday-village-main.jpg',
            additional: ['assets/holiday-village-1.jpg', 'assets/holiday-village-2.jpg']
        },
        rating: 4,
        reviews: ['Simply Brilliant', 'Best Holiday Ever']
    }
];

// Show/hide sections
function showSection(sectionId) {
    console.log('Showing section:', sectionId);
    // Hide all sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Show requested section
    const section = document.getElementById(sectionId);
    if (!section) {
        console.error('Could not find section:', sectionId);
        return;
    }
    section.classList.remove('hidden');
    console.log('Section shown:', sectionId);
    
if (sectionId === 'landing') {
    const video = document.getElementById('birthdayVideo');
    if (video) {
        video.muted = true; // Ensure autoplay works
        video.play().catch(e => console.log('Auto-play prevented:', e));
    }
}

if (sectionId === 'confirmation') {
    const iframe = document.getElementById('birthdayVideo2');
    iframe.src += "&autoplay=1"; // Forces YouTube autoplay
}
}

function selectGift(type) {
    console.log('selectGift called with type:', type);
    if (!type) {
        console.error('No gift type specified');
        return;
    }

    giftChoices.type = type;
    if (type === 'sun') {
        console.log('Showing hotels section');
        showSection('hotels');
        // Wait for the section to be visible before populating
        setTimeout(() => {
            populateHotels();
        }, 100);
    } else {
        console.log('Showing dates section');
        showSection('dates');
    }
}


function populateHotels() {
    const container = document.getElementById('hotels-container');
    if (!container) {
        console.error('Hotels container not found.');
        return;
    }

    fetch('hotels.json')
        .then(response => response.json())
        .then(hotels => {
            container.innerHTML = hotels.map(hotel => `
                <div class="bg-white rounded-xl shadow-lg overflow-hidden p-6">
                    <h3 class="text-2xl font-bold text-gray-800 mb-4">
                        <a href="${hotel.link}" target="_blank" class="text-purple-600 hover:underline">${hotel.name}</a>
                    </h3>
                    <div class="aspect-video mb-6">
                        <img src="${hotel.images[0]}" alt="${hotel.name}" class="w-full h-full object-cover rounded-lg">
                    </div>
                    <ul class="space-y-2">
                        ${hotel.features.slice(0, 5).map(feature => `
                            <li class="flex items-start gap-2">
                                <span class="text-purple-600">★</span> ${feature}
                            </li>
                        `).join('')}
                    </ul>
                    <button onclick="selectHotel('${hotel.name}')" class="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full">
                        Choose This Hotel
                    </button>
                </div>
            `).join('');
            console.log('Hotels loaded successfully.');
        })
        .catch(error => {
            console.error('Error fetching hotels:', error);
            container.innerHTML = '<div class="text-red-600">Failed to load hotels. Please try again.</div>';
        });
}



function selectHotel(hotelId) {
    giftChoices.hotel = hotels.find(h => h.id === hotelId);
    showSection('dates');
}

function nextStep(currentSection) {
    if (currentSection === 'dates') {
        const selectedDate = document.querySelector('input[name="date"]:checked');
        if (!selectedDate) {
            alert('Please select a date');
            return;
        }
        giftChoices.date = selectedDate.value;
        showSection('group');
    } else if (currentSection === 'group') {
        const selectedAttendees = Array.from(document.querySelectorAll('input[name="attendees"]:checked'))
            .map(input => input.value);
        if (selectedAttendees.length < 2) { // Minimum 2 people (Leanne and Ray)
            alert('Please select who is coming along');
            return;
        }
        giftChoices.attendees = selectedAttendees;
        showSection('confirmation');
    }
}

function updateGiftSummary() {
    const summary = document.getElementById('giftSummary');
    const giftType = giftChoices.type === 'centerparcs' ? 'Center Parcs' : 'Week in the Sun';
    const location = giftChoices.hotel ? ` at ${giftChoices.hotel.name} in ${giftChoices.hotel.location}` : '';
    
    // Convert date value to display text
    let dateText;
    switch(giftChoices.date) {
        case 'april14': dateText = 'April 14th'; break;
        case 'april21': dateText = 'April 21st'; break;
        case 'june': dateText = 'June'; break;
        case 'july': dateText = 'July'; break;
        default: dateText = 'Date not selected';
    }
    
    // Format attendees list
    const attendees = giftChoices.attendees
        .map(name => name.charAt(0).toUpperCase() + name.slice(1))
        .join(', ');
    
    summary.innerHTML = `
        <p>You've chosen: <strong>${giftType}${location}</strong></p>
        <p>When: <strong>${dateText}</strong></p>
        <p>Who's coming: <strong>${attendees}</strong></p>
    `;

    // Update location video
    const videoElement = document.getElementById('locationVideo');
    if (giftChoices.type === 'centerparcs') {
        videoElement.src = 'assets/centerparcs.mp4';
    } else if (giftChoices.hotel) {
        videoElement.src = giftChoices.hotel.video;
    }
    videoElement.load();
}

function showConfetti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
}

function restart() {
    giftChoices = {
        type: null,
        hotel: null,
        date: null,
        attendees: ['leanne', 'ray'] // Default attendees
    };
    showSection('landing');
}

// Start with landing page
document.addEventListener('DOMContentLoaded', () => {
    showSection('landing');
}); 

function startBackgroundSlideshow() {
    const images = [
        "converted_images/photo1.jpg", "converted_images/photo2.jpg", "converted_images/photo3.jpg",
        "converted_images/photo4.jpg", "converted_images/photo5.jpg", "converted_images/photo6.jpg",
        "converted_images/photo7.jpg", "converted_images/photo8.jpg", "converted_images/photo9.jpg",
        "converted_images/photo10.jpg", "converted_images/photo11.jpg", "converted_images/photo12.jpg"
    ];

    const bgContainer = document.getElementById('background-montage');

    // Generate background images in a grid
    images.forEach((image, index) => {
        let imgElement = document.createElement("div");
        imgElement.classList.add("w-full", "h-full", "bg-cover", "bg-center", "transition-opacity", "duration-500");
        imgElement.style.backgroundImage = `url('${image}')`;
        imgElement.style.opacity = "0";
        bgContainer.appendChild(imgElement);

        // Add fade-in animation at different times
        setTimeout(() => {
            imgElement.style.opacity = "1";
        }, index * 500);
    });

    // Animate images every few seconds
    setInterval(() => {
        let children = bgContainer.children;
        let first = children[0];
        first.style.opacity = "0";
        setTimeout(() => {
            bgContainer.removeChild(first);
            bgContainer.appendChild(first);
            first.style.opacity = "1";
        }, 500);
    }, 5000);
}

// Start the slideshow on page load
document.addEventListener("DOMContentLoaded", startBackgroundSlideshow);


