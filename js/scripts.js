'use strict';

const header = document.querySelector('.header');
const headingBox = document.querySelector('.header__primary-box');
const nav = document.querySelector('.nav');
const navLink = document.querySelector('.nav__link');
const sectionFirst = document.querySelector('.section-first');
const sliderImg1 = document.querySelector('.slider__img1');
const sliderTextArr = document.querySelectorAll('.slider__text');
const headingSecond = document.querySelector('.slider__text5');
const paragraphSecond = document.querySelector('.slider__text6');
const sectionSecond = document.querySelector('.section-second');
const description = document.querySelector('.description');
const gallery = document.querySelector('.gallery');
const lazyPictures = document.querySelectorAll('.lazy-pictures');
const kitchen = document.querySelectorAll('#kitchen');
const shower = document.querySelectorAll('#shower');
const garden = document.querySelectorAll('#garden-room');
const allSections = document.querySelectorAll('.section__observer');
const allBanners = document.querySelectorAll('.banner');

//////////////////////////////////////////////////////////////////////////////
// Fades in text on page load

const timerObj = {
    slider__img1: 240,
    slider__text1: 800,
    slider__text2: 860,
    slider__text3: 940,
    slider__text4: 980,
};

sliderTextArr.forEach((sliderText, index) => {
    sliderText.classList.add(`slider__text${index + 1}--hidden`);
    window.addEventListener('load', () => {
        setTimeout(() => {
            sliderText.classList.remove(`slider__text${index + 1}--hidden`);
        }, timerObj[`slider__text${index + 1}`]);
    }),
        { once: true };
});

//////////////////////////////////////////////////////////////////////////////
// Reveals first image by decreasing slider width

const slideImg1 = () => {
    sliderImg1.classList.add('slider__img1--visible');
    window.addEventListener(
        'load',
        () => {
            setTimeout(() => {
                sliderImg1.classList.remove('slider__img1--visible');
            }, timerObj.slider__img1);
        },
        { once: true }
    );
};

slideImg1();

//////////////////////////////////////////////////////////////////////////////
// Removes hidden class from header items

const removeHiddenClass = (element, time) => {
    element.style.transition = 'all 0s';
    setTimeout(() => {
        element.removeAttribute('style');
    }, 1);
    setTimeout(() => {
        element.classList.remove('hidden');
    }, time);
};

const addHiddenClass = (element) => {
    element.classList.add('hidden');
};

addHiddenClass(headingBox);
addHiddenClass(nav);
removeHiddenClass(headingBox, 950);
removeHiddenClass(nav, 745);

//////////////////////////////////////////////////////////////////////////////
// Reduces header height using intersection observer

const headerPaddingReducer = function (entries, observer) {
    const [entry] = entries;

    if (!entry.isIntersecting) {
        return header.classList.add(`header--reduced-height`);
    }

    return header.classList.remove(`header--reduced-height`);
};

const headerObserver = new IntersectionObserver(headerPaddingReducer, {
    root: null,
    threshold: [0.7],
    rootMargin: '0px',
});

const headerObserverInit = () => {
    headerObserver.observe(sectionFirst);
};

headerObserverInit();

//////////////////////////////////////////////////////////////////////////////
// Fades in second section text

const slideTextLeft = function (entries, observer) {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        setTimeout(() => {
            headingSecond.classList.remove(`slider__text5--hidden`);
        }, 140);
        setTimeout(() => {
            paragraphSecond.classList.remove(`slider__text6--hidden`);
        }, 170);

        observer.unobserve(sectionSecond);
    });
};

const sliderObserver = new IntersectionObserver(slideTextLeft, {
    root: null,
    threshold: [0.32, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
});

const sliderInit = () => {
    headingSecond.classList.add(`slider__text5--hidden`);
    paragraphSecond.classList.add(`slider__text6--hidden`);
    sliderObserver.observe(sectionSecond);
};

sliderInit();

//////////////////////////////////////////////////////////////////////////////
// Reveals second section

const revealSection = function (entries, observer) {
    const [entry] = entries;
    if (!entry.isIntersecting) return;

    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
});

allSections.forEach((section) => {
    section.classList.add('section--hidden');
});

sectionObserver.observe(sectionSecond);

//////////////////////////////////////////////////////////////////////////////
// Fades in banners/banner sections

const slideBannerRight = function (entries, observer) {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        if (entry.target.id === 'banner-description') {
            entry.target.classList.remove('banner--hidden');
            description.classList.remove('section--hidden');
        }
        if (entry.target.id === 'banner-gallery') {
            entry.target.classList.remove('banner--hidden');
            gallery.classList.remove('section--hidden');
        }
        if (entry.target.id === 'banner-booking') {
            entry.target.classList.remove('banner--hidden');
            booking.classList.remove('section--hidden');
        }

        observer.unobserve(entry.target);
    });
};

const bannerObserver = new IntersectionObserver(slideBannerRight, {
    root: null,
    threshold: [0],
    rootMargin: '-50px',
});

allBanners.forEach((banner) => {
    banner.classList.add('banner--hidden');
    bannerObserver.observe(banner);
});

//////////////////////////////////////////////////////////////////////////////
// Gallery code
let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
    showSlides((slideIndex += n));
}

// Thumbnail image controls
function currentSlide(n) {
    showSlides((slideIndex = n));
}

function showSlides(n) {
    let i;
    const slides = document.getElementsByClassName('gallery--hidden');
    const dots = document.getElementsByClassName('demo');
    const captionText = document.getElementById('caption');
    if (n > slides.length) {
        slideIndex = 1;
    }
    if (n < 1) {
        slideIndex = slides.length;
    }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = 'none';
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(' active', '');
    }
    slides[slideIndex - 1].style.display = 'block';
    dots[slideIndex - 1].className += ' active';
    captionText.innerHTML = dots[slideIndex - 1].alt;
}

//////////////////////////////////////////////////////////////////////////////
// Lazy loading images

const loadImg = function (entries, observer) {
    const [entry] = entries;

    if (!entry.isIntersecting) return;
    // Sets srcset/src for all child source/img elements of selected picture element
    lazyPictures.forEach((picture) => {
        const el = picture.children;
        el[0].srcset = `images/webp/${el[2].id}.webp`;
        el[1].srcset = `images/${el[2].id}.jpg`;
        el[2].src = `images/${el[2].id}.jpg`;
    });

    observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
    root: null,
    threshold: 0,
});

imgObserver.observe(gallery);
