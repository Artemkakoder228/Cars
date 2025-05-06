const brandsSection = document.getElementById('section-brands');
const modelsSection = document.getElementById('section-models');
const yearsSection = document.getElementById('section-years');
const imagesSection = document.getElementById('section-images');
const imageModal = document.getElementById('image-modal');
const modalImg = document.getElementById('modal-img');
const closeBtn = document.getElementById('close-btn');
const dataFileRadios = document.querySelectorAll('input[name="dataFile"]');

// Load JSON data
function fetchJSON(file) {
    brandsSection.innerHTML = '';
    modelsSection.innerHTML = '';
    yearsSection.innerHTML = '';
    imagesSection.innerHTML = '';

    fetch(file)
        .then(response => response.json())
        .then(data => {
            const carData = processCarData(data);
            renderBrands(carData);
        })
        .catch(error => console.error(`Error loading ${file}:`, error));
}

// Event listener for radio buttons
dataFileRadios.forEach(radio => {
    radio.addEventListener('change', (event) => {
        const selectedFile = event.target.value;
        fetchJSON(selectedFile);
    });
});

// Initial load
fetchJSON('js/sample.json');

// Parse JSON data into a structured format
function processCarData(data) {
    const carData = {};
    for (const path in data) {
        const parts = path.split('/');
        if (parts.length < 4) {
            console.warn(`Invalid path format: ${path}`);
            continue;
        }

        const [brand, model, year] = parts;
        if (!carData[brand]) carData[brand] = {};
        if (!carData[brand][model]) carData[brand][model] = {};
        if (!carData[brand][model][year]) carData[brand][model][year] = [];
        carData[brand][model][year].push(data[path]);
    }
    return carData;
}

// Display car brands
function renderBrands(carData) {
    brandsSection.innerHTML = '';
    const sortedBrands = Object.keys(carData).sort();
    sortedBrands.forEach(brand => {
        const button = document.createElement('button');
        button.textContent = brand;
        button.onclick = () => renderModels(carData[brand]);
        brandsSection.appendChild(button);
    });
}

// Display car models
function renderModels(models) {
    modelsSection.innerHTML = '';
    yearsSection.innerHTML = '';
    imagesSection.innerHTML = '';
    const sortedModels = Object.keys(models).sort();
    sortedModels.forEach(model => {
        const button = document.createElement('button');
        button.textContent = model;
        button.onclick = () => renderYears(models[model]);
        modelsSection.appendChild(button);
    });
}

// Display car years
function renderYears(years) {
    yearsSection.innerHTML = '';
    imagesSection.innerHTML = '';
    const sortedYears = Object.keys(years).sort();
    sortedYears.forEach(year => {
        const button = document.createElement('button');
        button.textContent = year;
        button.onclick = () => renderImages(years[year]);
        yearsSection.appendChild(button);
    });
}

// Display car images
function renderImages(images) {
    imagesSection.innerHTML = '';
    images.forEach(image => {
        const img = new Image();
        img.src = image;

        img.onload = () => {
            if (img.naturalWidth > 1 && img.naturalHeight > 1) {
                const imgElement = document.createElement('img');
                imgElement.src = image;
                imgElement.onclick = () => openImageModal(image);
                imagesSection.appendChild(imgElement);
            }
        };

        img.onerror = () => {
            console.warn(`Image not found or invalid: ${image}`);
        };
    });
}

// Open modal
function openImageModal(imageSrc) {
    imageModal.style.display = 'block';
    modalImg.src = imageSrc;
}

// Close modal
closeBtn.onclick = () => {
    imageModal.style.display = 'none';
};

// Close modal when clicking outside the image
window.onclick = (event) => {
    if (event.target === imageModal) {
        imageModal.style.display = 'none';
    }
};