const brandsSection = document.getElementById('section-brands');
const modelsSection = document.getElementById('section-models');
const yearsSection = document.getElementById('section-years');
const imagesSection = document.getElementById('section-images');
const imageModal = document.getElementById('image-modal');
const modalImg = document.getElementById('modal-img');
const closeBtn = document.getElementById('close-btn');
const dataFileRadios = document.querySelectorAll('input[name="dataFile"]');
const slider = document.getElementById('image-slider');

let currentData = {}; // Кеш для збереження даних

// Завантаження JSON-файлу
function fetchJSON(files) {
    brandsSection.innerHTML = '';
    modelsSection.innerHTML = '';
    yearsSection.innerHTML = '';
    imagesSection.innerHTML = '';
    slider.innerHTML = '';

    fetch(files[0])
        .then(response => response.json())
        .then(data => {
            currentData = data; // Зберігаємо дані в кеш
            const carData = processCarData(data);
            renderBrands(carData);
            loadSliderImagesFromData(data);
        })
        .catch(error => console.error(`Error loading file:`, error));
}

// Обробка даних JSON
function processCarData(data) {
    const carData = {};
    for (const path in data) {
        const parts = path.split('/');
        if (parts.length < 4) continue;

        const [brand, model, year] = parts;
        carData[brand] = carData[brand] || {};
        carData[brand][model] = carData[brand][model] || {};
        carData[brand][model][year] = carData[brand][model][year] || [];
        carData[brand][model][year].push(data[path]);
    }
    return carData;
}

// Відображення брендів
function renderBrands(carData) {
    const fragment = document.createDocumentFragment();
    Object.keys(carData).sort().forEach(brand => {
        const button = document.createElement('button');
        button.textContent = brand;
        button.onclick = () => renderModels(carData[brand]);
        fragment.appendChild(button);
    });
    brandsSection.appendChild(fragment);
}

// Відображення моделей
function renderModels(models) {
    modelsSection.innerHTML = '';
    yearsSection.innerHTML = '';
    imagesSection.innerHTML = '';
    const fragment = document.createDocumentFragment();
    Object.keys(models).sort().forEach(model => {
        const button = document.createElement('button');
        button.textContent = model;
        button.onclick = () => renderYears(models[model]);
        fragment.appendChild(button);
    });
    modelsSection.appendChild(fragment);
}

// Відображення років
function renderYears(years) {
    yearsSection.innerHTML = '';
    imagesSection.innerHTML = '';
    const fragment = document.createDocumentFragment();
    Object.keys(years).sort().forEach(year => {
        const button = document.createElement('button');
        button.textContent = year;
        button.onclick = () => renderImages(years[year]);
        fragment.appendChild(button);
    });
    yearsSection.appendChild(fragment);
}

// Відображення зображень
function renderImages(images) {
    imagesSection.innerHTML = '';
    const fragment = document.createDocumentFragment();
    images.forEach(image => {
        const img = new Image();
        img.src = image;
        img.loading = 'lazy'; // Lazy loading
        img.onerror = () => {
            img.src = 'path/to/placeholder.jpg'; // Замінюємо на зображення-заглушку
        };
        img.onclick = () => openImageModal(image);
        fragment.appendChild(img);
    });
    imagesSection.appendChild(fragment);
}

// Відкриття модального вікна
function openImageModal(imageSrc) {
    imageModal.style.display = 'block';
    modalImg.src = imageSrc;
}

// Закриття модального вікна
closeBtn.onclick = () => {
    imageModal.style.display = 'none';
};

window.onclick = (event) => {
    if (event.target === imageModal) {
        imageModal.style.display = 'none';
    }
};

// Статичний масив зображень
const staticImages = [
    'images/1513313.jpg',
    'images/c24e82738d697d0ab4e74d9750582ae1bbf71a9f.jpg',
    'images/im-dodge_challenger_srt_demon_8.jpeg',
    'images/image5-1.png',
    'images/images.jpg',
    'images/Kia-Sportage-2020-f3b-huge-1551.jpg'
];

// Завантаження зображень у слайдер
function loadSliderImages() {
    slider.innerHTML = ''; // Очищаємо слайдер перед додаванням нових зображень
    const fragment = document.createDocumentFragment();

    staticImages.forEach(imageSrc => {
        const img = document.createElement('img');
        img.src = imageSrc;
        img.loading = 'lazy'; // Lazy loading
        img.onerror = () => {
            img.src = 'images/placeholder.jpg'; // Замінюємо на зображення-заглушку
        };
        fragment.appendChild(img);
    });

    slider.appendChild(fragment);
    startImageSlider();
}

// Автоматична прокрутка слайдера
function startImageSlider() {
    let scrollAmount = 0;
    const maxScroll = slider.scrollWidth;

    function slide() {
        scrollAmount -= 2; // Плавна прокрутка
        if (Math.abs(scrollAmount) >= maxScroll) {
            scrollAmount = 0;
        }
        slider.style.transform = `translateX(${scrollAmount}px)`;
        requestAnimationFrame(slide);
    }

    slide();
}

// Обробка вибору файлу
dataFileRadios.forEach(radio => {
    radio.addEventListener('change', (event) => {
        const selectedFile = event.target.value;
        fetchJSON([`js/${selectedFile}`]);
    });
});

// Початкове завантаження
fetchJSON(['js/sample.json']);

// Виклик функції для завантаження зображень
loadSliderImages();

// Показ модального вікна при завантаженні сторінки
window.onload = () => {
    const welcomeModal = document.getElementById('welcome-modal');
    const closeWelcomeBtn = document.getElementById('close-welcome-btn');

    // Перевіряємо, чи існує модальне вікно
    if (welcomeModal) {
        // Показуємо модальне вікно
        welcomeModal.style.display = 'flex';

        // Закриваємо модальне вікно при натисканні кнопки
        closeWelcomeBtn.onclick = () => {
            welcomeModal.style.display = 'none';
        };

        // Закриваємо модальне вікно при кліку поза його межами
        window.onclick = (event) => {
            if (event.target === welcomeModal) {
                welcomeModal.style.display = 'none';
            }
        };
    }
};