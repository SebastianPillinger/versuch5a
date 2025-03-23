// Dynamisches Laden der Portfolio-Bilder
const portfolioData = [
    { src: "bilder/linzm1.jpg", alt: "Linz-Marathon", images: ["bilder/linzm1.jpg", "bilder/linzm2.jpg", "bilder/linzm3.jpg"] },
    { src: "bilder/rr1.jpg", alt: "Kasberg-Inferno", images: ["bilder/rr1.jpg", "bilder/rr2.jpg", "bilder/rr3.jpg", "bilder/rr4.jpg", "bilder/rr5.jpg"] },
    { src: "bilder/hochzeit1.jpg", alt: "Hochzeitsfotografie", images: ["bilder/hochzeit1.jpg", "bilder/hochzeit2.jpg", "bilder/hochzeit3.jpg"] },
    { src: "bilder/tiere1.jpg", alt: "Haustiere", images: ["bilder/tiere1.jpg", "bilder/tiere2.jpg", "bilder/tiere3.jpg", "bilder/tiere4.jpg", "bilder/tiere5.jpg", "bilder/tiere6.jpg", "bilder/tiere7.jpg", "bilder/tiere8.jpg"] },
    { src: "bilder/wildlife1.jpg", alt: "Wildlife", images: ["bilder/wildlife1.jpg", "bilder/wildlife2.jpg", "bilder/wildlife3.jpg", "bilder/wildlife4.jpg", "bilder/wildlife5.jpg", "bilder/wildlife6.jpg"] },
    { src: "bilder/party1.jpg", alt: "Partyfotografie", images: ["bilder/party1.jpg", "bilder/party2.jpg", "bilder/party3.jpg"] }
];

const portfolioGallery = document.getElementById("portfolio-gallery");

portfolioData.forEach(item => {
    const container = document.createElement("div");
    container.className = "image-container";
    container.innerHTML = `
        <img src="${item.src}" alt="${item.alt}" loading="lazy">
        <div class="overlay-text">${item.alt}</div>
    `;
    container.addEventListener("click", () => openLightbox(item.src, item.images));
    portfolioGallery.appendChild(container);
});

// Lightbox-Funktionen
let currentIndex = 0;
let images = [];
let nextImage = new Image(); // Für Vorladen des nächsten Bildes

// Tastatursteuerung
document.addEventListener("keydown", (event) => {
    const lightbox = document.getElementById("lightbox");
    if (lightbox.classList.contains("active")) {
        if (event.key === "ArrowRight") changeImage(1);
        if (event.key === "ArrowLeft") changeImage(-1);
        if (event.key === "Escape") closeLightbox();
    }
});

function openLightbox(imageSrc, imageList) {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    lightboxImg.style.opacity = "1"; // Sicherstellen, dass Bild sichtbar ist
    lightboxImg.src = imageSrc;
    lightbox.classList.add("active");
    images = imageList;
    currentIndex = images.indexOf(imageSrc);
    document.body.style.overflow = "hidden";
    
    // Vorladen der Nachbarbilder
    preloadNeighbors(currentIndex);
}

function closeLightbox() {
    const lightbox = document.getElementById("lightbox");
    lightbox.classList.remove("active");
    document.body.style.overflow = "auto";
    
    // Reset aller Transforms
    const lightboxImg = document.getElementById("lightbox-img");
    lightboxImg.style.transform = "translateX(0)";
    lightboxImg.style.opacity = "1";
}

function changeImage(n) {
    const newIndex = (currentIndex + n + images.length) % images.length;
    lightboxImg.src = images[newIndex]; // Direkter Wechsel
    currentIndex = newIndex;
    preloadNeighbors(newIndex);
}

// Hilfsfunktion zum Vorladen
function preloadNeighbors(index) {
    const prevImg = new Image();
    const nextImg = new Image();
    prevImg.src = images[(index - 1 + images.length) % images.length];
    nextImg.src = images[(index + 1) % images.length];
}

// Touch-Events für Wischfunktion
let touchStartX = 0;
let touchStartY = 0;
let isSwiping = false;
let lightboxImg = document.getElementById('lightbox-img');

function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
    isSwiping = true;
    lightboxImg.style.transition = 'none'; // Keine Animation während des Swipens
}

function handleTouchMove(event) {
    if (!isSwiping) return;

    const touchCurrentX = event.touches[0].clientX;
    const touchCurrentY = event.touches[0].clientY;
    const deltaX = touchCurrentX - touchStartX;
    const deltaY = touchCurrentY - touchStartY;

    // Primäre Richtung ermitteln
    const isVertical = Math.abs(deltaY) > Math.abs(deltaX);

    if (isVertical) {
        // Vertikales Wischen - mit Dämpfungseffekt
        const dampenedDelta = deltaY * 0.5; // Reduziert die Bewegung um 50%
        lightboxImg.style.transform = `translateY(${dampenedDelta}px)`;
        return;
    }

    // Horizontales Wischen mit Begrenzung
    const maxDelta = window.innerWidth * 0.2;
    const limitedDelta = Math.sign(deltaX) * Math.min(Math.abs(deltaX), maxDelta);
    lightboxImg.style.transform = `translateX(${limitedDelta}px)`;
}

function handleTouchEnd(event) {
    if (!isSwiping) return;

    const deltaX = event.changedTouches[0].clientX - touchStartX;
    const deltaY = event.changedTouches[0].clientY - touchStartY;
    const isVertical = Math.abs(deltaY) > Math.abs(deltaX);

    // Zurücksetzen der Position
    lightboxImg.style.transform = 'translate(0, 0)';
    
    // Zuerst vertikales Wischen prüfen
    if (isVertical) {
        if (Math.abs(deltaY) > 100) {
            closeLightbox();
        }
        return; // Vertikale Aktion beendet hier
    }

    // Horizontales Wischen verarbeiten
    const absDeltaX = Math.abs(deltaX);
    const maxDelta = window.innerWidth * 0.1;

    if (absDeltaX >= maxDelta) {
        const direction = Math.sign(deltaX);
        changeImage(-direction);
        return;
    }

    if (absDeltaX > 100) {
        const direction = deltaX > 0 ? -1 : 1;
        changeImage(direction);
    }

    isSwiping = false;
}

// Event-Listener
const lightbox = document.getElementById('lightbox');
lightbox.addEventListener('touchstart', handleTouchStart, { passive: false });
lightbox.addEventListener('touchmove', handleTouchMove, { passive: false });
lightbox.addEventListener('touchend', handleTouchEnd, { passive: true });

// Kopieren in die Zwischenablage
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert("Kopiert: " + text);
    }).catch(() => {
        alert("Kopieren fehlgeschlagen. Bitte manuell kopieren: " + text);
    });
}

// Smooth Scroll für interne Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); // Verhindert das Standardverhalten
        const targetId = this.getAttribute('href').substring(1); // Holt die Ziel-ID
        const targetElement = document.getElementById(targetId); // Findet das Ziel-Element

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth', // Sanftes Scrollen
                block: 'start' // Scrollt zum Anfang des Abschnitts
            });
        }
    });
});
