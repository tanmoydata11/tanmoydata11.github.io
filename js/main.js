/* ============================================================
   main.js — Tanmoy Ghatak Portfolio
   Sections:
   1. Smooth Scroll
   2. Active Nav Link on Scroll
   ============================================================ */

/* ----------------------------------------------------------
   1. Smooth Scroll
   Intercepts clicks on anchor links (#section) and scrolls
   smoothly instead of jumping.
   ---------------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/* ----------------------------------------------------------
   2. Active Nav Link on Scroll
   Adds the "active" class to whichever nav link corresponds
   to the section currently visible in the viewport.
   ---------------------------------------------------------- */
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

/* ----------------------------------------------------------
   3. Modal System
   ---------------------------------------------------------- */

const TOTAL_SLIDES = 16;
let currentSlide = 1;

function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    if (id === 'presentationModal') {
        buildThumbnails();
        goToSlide(1);
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
}

// Click outside modal box → close
function handleModalClick(event, id) {
    if (event.target === document.getElementById(id)) {
        closeModal(id);
    }
}

// Keyboard: Escape closes, arrows navigate slides
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.is-open').forEach(m => closeModal(m.id));
    }
    if (document.getElementById('presentationModal')?.classList.contains('is-open')) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') changeSlide(1);
        if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   changeSlide(-1);
    }
});

/* -- Slide navigation -- */

function padSlide(n) {
    return String(n).padStart(2, '0');
}

function goToSlide(n) {
    currentSlide = Math.max(1, Math.min(n, TOTAL_SLIDES));

    const img = document.getElementById('slideImage');
    if (img) {
        img.style.opacity = '0';
        img.src = `assets/projects/hr-attrition/slide-${padSlide(currentSlide)}.jpg`;
        img.alt = `Slide ${currentSlide}`;
        img.onload = () => { img.style.opacity = '1'; };
    }

    // Update counter
    const counter = document.getElementById('slideCounter');
    if (counter) counter.textContent = `${currentSlide} / ${TOTAL_SLIDES}`;

    // Update thumbnails
    document.querySelectorAll('.slide-thumb').forEach((thumb, i) => {
        thumb.classList.toggle('active', i + 1 === currentSlide);
        if (i + 1 === currentSlide) {
            thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    });

    // Disable nav buttons at edges
    const prev = document.querySelector('.slide-nav--prev');
    const next = document.querySelector('.slide-nav--next');
    if (prev) prev.disabled = currentSlide === 1;
    if (next) next.disabled = currentSlide === TOTAL_SLIDES;
}

function changeSlide(delta) {
    goToSlide(currentSlide + delta);
}

function buildThumbnails() {
    const strip = document.getElementById('slideThumbs');
    if (!strip || strip.children.length > 0) return; // already built

    for (let i = 1; i <= TOTAL_SLIDES; i++) {
        const thumb = document.createElement('div');
        thumb.className = 'slide-thumb';
        thumb.setAttribute('title', `Slide ${i}`);
        thumb.onclick = () => goToSlide(i);

        const img = document.createElement('img');
        img.src = `assets/projects/hr-attrition/slide-${padSlide(i)}.jpg`;
        img.alt = `Slide ${i}`;
        img.loading = 'lazy';

        thumb.appendChild(img);
        strip.appendChild(thumb);
    }

    // Add keyboard hint
    const hint = document.createElement('p');
    hint.className = 'slide-keyboard-hint';
    hint.textContent = 'Use ← → arrow keys to navigate';
    strip.parentElement.appendChild(hint);
}

/* ----------------------------------------------------------
   4. E-Commerce Presentation Modal (separate slide state)
   ---------------------------------------------------------- */

const EC_TOTAL_SLIDES = 12;
let ecCurrentSlide = 1;

function changeEcSlide(delta) {
    ecCurrentSlide = Math.max(1, Math.min(ecCurrentSlide + delta, EC_TOTAL_SLIDES));

    const img = document.getElementById('ecSlideImage');
    if (img) {
        img.style.opacity = '0';
        img.src = `assets/projects/ecommerce-sales/ec-slide-${padSlide(ecCurrentSlide)}.jpg`;
        img.alt = `Slide ${ecCurrentSlide}`;
        img.onload = () => { img.style.opacity = '1'; };
    }

    const counter = document.getElementById('ecSlideCounter');
    if (counter) counter.textContent = `${ecCurrentSlide} / ${EC_TOTAL_SLIDES}`;

    document.querySelectorAll('#ecSlideThumbs .slide-thumb').forEach((thumb, i) => {
        thumb.classList.toggle('active', i + 1 === ecCurrentSlide);
        if (i + 1 === ecCurrentSlide) {
            thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    });

    const prev = document.getElementById('ecPrev');
    const next = document.getElementById('ecNext');
    if (prev) prev.disabled = ecCurrentSlide === 1;
    if (next) next.disabled = ecCurrentSlide === EC_TOTAL_SLIDES;
}

function buildEcThumbnails() {
    const strip = document.getElementById('ecSlideThumbs');
    if (!strip || strip.children.length > 0) return;

    for (let i = 1; i <= EC_TOTAL_SLIDES; i++) {
        const thumb = document.createElement('div');
        thumb.className = 'slide-thumb';
        thumb.setAttribute('title', `Slide ${i}`);
        thumb.onclick = () => {
            ecCurrentSlide = i;
            changeEcSlide(0);
        };

        const img = document.createElement('img');
        img.src = `assets/projects/ecommerce-sales/ec-slide-${padSlide(i)}.jpg`;
        img.alt = `Slide ${i}`;
        img.loading = 'lazy';

        thumb.appendChild(img);
        strip.appendChild(thumb);
    }

    const hint = document.createElement('p');
    hint.className = 'slide-keyboard-hint';
    hint.textContent = 'Use ← → arrow keys to navigate';
    strip.parentElement.appendChild(hint);
}

// Hook into openModal to build ec thumbnails
const _origOpenModal = openModal;
window.openModal = function(id) {
    _origOpenModal(id);
    if (id === 'ecommercePresentationModal') {
        buildEcThumbnails();
        ecCurrentSlide = 1;
        changeEcSlide(0);
    }
};

// Arrow key support for ec modal
document.addEventListener('keydown', (e) => {
    if (document.getElementById('ecommercePresentationModal')?.classList.contains('is-open')) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') changeEcSlide(1);
        if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   changeEcSlide(-1);
    }
});

/* ----------------------------------------------------------
   5. Mobile Behavior Presentation Modal
   ---------------------------------------------------------- */

const UB_TOTAL_SLIDES = 14;
let ubCurrentSlide = 1;

function changeUbSlide(delta) {
    ubCurrentSlide = Math.max(1, Math.min(ubCurrentSlide + delta, UB_TOTAL_SLIDES));

    const img = document.getElementById('ubSlideImage');
    if (img) {
        img.style.opacity = '0';
        img.src = `assets/projects/mobile-behavior/ub-slide-${padSlide(ubCurrentSlide)}.jpg`;
        img.alt = `Slide ${ubCurrentSlide}`;
        img.onload = () => { img.style.opacity = '1'; };
    }

    const counter = document.getElementById('ubSlideCounter');
    if (counter) counter.textContent = `${ubCurrentSlide} / ${UB_TOTAL_SLIDES}`;

    document.querySelectorAll('#ubSlideThumbs .slide-thumb').forEach((thumb, i) => {
        thumb.classList.toggle('active', i + 1 === ubCurrentSlide);
        if (i + 1 === ubCurrentSlide) {
            thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    });

    const prev = document.getElementById('ubPrev');
    const next = document.getElementById('ubNext');
    if (prev) prev.disabled = ubCurrentSlide === 1;
    if (next) next.disabled = ubCurrentSlide === UB_TOTAL_SLIDES;
}

function buildUbThumbnails() {
    const strip = document.getElementById('ubSlideThumbs');
    if (!strip || strip.children.length > 0) return;

    for (let i = 1; i <= UB_TOTAL_SLIDES; i++) {
        const thumb = document.createElement('div');
        thumb.className = 'slide-thumb';
        thumb.setAttribute('title', `Slide ${i}`);
        thumb.onclick = () => { ubCurrentSlide = i; changeUbSlide(0); };

        const img = document.createElement('img');
        img.src = `assets/projects/mobile-behavior/ub-slide-${padSlide(i)}.jpg`;
        img.alt = `Slide ${i}`;
        img.loading = 'lazy';

        thumb.appendChild(img);
        strip.appendChild(thumb);
    }

    const hint = document.createElement('p');
    hint.className = 'slide-keyboard-hint';
    hint.textContent = 'Use ← → arrow keys to navigate';
    strip.parentElement.appendChild(hint);
}

// Extend openModal for mobile modal
const _origOpenModal2 = window.openModal;
window.openModal = function(id) {
    _origOpenModal2(id);
    if (id === 'mobilePresentationModal') {
        buildUbThumbnails();
        ubCurrentSlide = 1;
        changeUbSlide(0);
    }
};

// Arrow key support
document.addEventListener('keydown', (e) => {
    if (document.getElementById('mobilePresentationModal')?.classList.contains('is-open')) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') changeUbSlide(1);
        if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   changeUbSlide(-1);
    }
});
