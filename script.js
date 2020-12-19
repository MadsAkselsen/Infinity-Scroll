// This project is limited to 50 fetch calls to the API per hour

const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];

// Unsplah API
let count = 5;
apiKey = '2umqhiDmFcKiOn6XOGQDowJXDcus1lfKr1St-r_mS6c';

// api key is public due to being for learning purposes and scope of this project. Normally, it should be hidden in a proxy server
let apiUrl = `http://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}
`;

//check if all images were loaded
function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    ready = true;
    loader.hidden = true;
    // after loading first 5 images change count to 10 and update the apiUrl to fetch 10 images every time
    count = 10;
    apiUrl = `http://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}
`;
  }
}

// Helper Function to set attributes on DOM elements
function setAttributes(elements, attributes) {
  for (const key in attributes) {
    elements.setAttribute(key, attributes[key]);
  }
}

function displayPhotos() {
  imagesLoaded = 0;
  totalImages = photosArray.length;

  photosArray.forEach((photo) => {
    const item = document.createElement('a');

    setAttributes(item, { href: photo.links.html, target: '_blank' });
    const img = document.createElement('img');

    setAttributes(img, {
      src: photo.urls.regular,
      alt: photo.alt_description,
      title: photo.alt_description,
    });

    img.addEventListener('load', imageLoaded);

    // put <img> inside <a>, then put both inside imageContainer element
    item.appendChild(img);
    imageContainer.appendChild(item);
  });
}

// Get photos from Unsplash API
async function getPhotos() {
  try {
    const response = await fetch(apiUrl);
    photosArray = await response.json();
    displayPhotos();
  } catch (error) {}
}

window.addEventListener('scroll', () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 &&
    ready
  ) {
    ready = false;

    getPhotos();
  }
});

getPhotos();
