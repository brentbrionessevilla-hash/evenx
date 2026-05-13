'use strict';


/*preload*/
const preloader = document.querySelector("[data-preload]");
window.addEventListener("load", function(){
    preloader.classList.add("loaded");
    document.body.classList.add("loaded");
});


/*add event listener on multiple elements*/
const addEventOneElements = function(elements, evenType, callback){
    for(let i = 0, len = elements.length; i< len; i++){
        elements[i].addEventListener(evenType, callback)
    }
}


/*navbar*/
const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");
const toggleNavbar = function(){
    navbar.classList.toggle("active");
    overlay.classList.toggle("active");
    document.body.classList.toggle("nav-active");
}
addEventOneElements(navTogglers, "click", toggleNavbar);
const navbarLinks = document.querySelectorAll("[data-nav-link]");
const closeNavbar = function () {
  navbar.classList.remove("active");
  overlay.classList.remove("active");
  document.body.classList.remove("nav-active");
}
addEventOneElements(navbarLinks, "click", closeNavbar);


/*header and back top btn*/
const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");
let lastScrollPos = 0;
const hideHeader = function () {
    const isScrollBottom = lastScrollPos < window.scrollY;
    if(isScrollBottom){
        header.classList.add("hide");
    }
    else{
        header.classList.remove("hide");
    }
    lastScrollPos = window.scrollY;
}
window.addEventListener("scroll", function(){
    if(window.scrollY >= 50){
        header.classList.add("active");
        backTopBtn.classList.add("active");
        hideHeader();
    }
    else{
        header.classList.remove("active");
        backTopBtn.classList.remove("active");
    }
});


/*hero slider*/
const heroSlider = document.querySelector("[data-hero-slider]");
const heroSliderItems = document.querySelectorAll("[data-hero-slider-item]");
const heroSliderPrevBtn = document.querySelector("[data-prev-btn]");
const heroSliderNextBtn = document.querySelector("[data-next-btn]");
let currentSliderPos = 0;
let lastActiveSliderItem = heroSliderItems[0];
const updateSliderPos = function(){
    lastActiveSliderItem.classList.remove("active");
    heroSliderItems[currentSliderPos].classList.add("active");
    lastActiveSliderItem = heroSliderItems[currentSliderPos];
}
const slideNext = function(){
    if(currentSliderPos >= heroSliderItems.length - 1){
    currentSliderPos = 0;
    }
    else{
        currentSliderPos++;
    }
    updateSliderPos();
}
heroSliderNextBtn.addEventListener("click", slideNext);
const slidePrev = function(){
    if(currentSliderPos <= 0){
        currentSliderPos = heroSliderItems.length - 1;
    }
    else{
        currentSliderPos--;
    }
    updateSliderPos();   
}
heroSliderPrevBtn.addEventListener("click", slidePrev);


/*auto slide*/
let autoSliderInterval;

const autoSlide = function(){
    autoSliderInterval = setInterval(function(){
        slideNext(); 
    }, 7000);
}
addEventOneElements([heroSliderNextBtn, heroSliderPrevBtn], "mouseover", function(){
    clearInterval(autoSliderInterval);
});
addEventOneElements([heroSliderNextBtn, heroSliderPrevBtn], "mouseout", autoSlide);
window.addEventListener("load", autoSlide);


/*parallax efect*/
const parallaxItems = document.querySelectorAll("[data-parallax-item]");
let x, y;
window.addEventListener("mousemove", function (event) {
    x = (event.clientX / window.innerWidth * 10) - 5;
    y = (event.clientY / window.innerHeight * 10) - 5;
    x = x - (x * 2);
    y = y - (y * 2);
    for(let i = 0, len = parallaxItems.length; i < len; i++){
        x = x * Number(parallaxItems[i].dataset.parallaxSpeed);
        y = y * Number(parallaxItems[i].dataset.parallaxSpeed);
        parallaxItems[i].style.transform = `translate3d(${x}px, ${y}px, 0px)`; 
    }
});


/*-----------------------------------*\
  #IMAGE CAROUSEL
\*-----------------------------------*/

const carouselTrack = document.querySelector("[data-carousel-track]");
const carouselSlides = document.querySelectorAll("[data-carousel-slide]");
const dots = document.querySelectorAll("[data-dot]");
const carouselPrevBtn = document.querySelector("[data-carousel-prev]");
const carouselNextBtn = document.querySelector("[data-carousel-next]");

if (carouselTrack && carouselSlides.length && dots.length && carouselPrevBtn && carouselNextBtn) {
    let currentSlide = 0;
    let autoPlayInterval;
    const slideCount = carouselSlides.length;

    // Update carousel position
    const updateCarousel = function() {
        const translateX = -currentSlide * 100;
        carouselTrack.style.transform = `translateX(${translateX}%)`;

        carouselSlides.forEach((slide, index) => {
            slide.classList.remove("active");
            if (index === currentSlide) {
                slide.classList.add("active");
            }
        });

        dots.forEach((dot, index) => {
            dot.classList.remove("active");
            if (index === currentSlide) {
                dot.classList.add("active");
            }
        });
    };

    const nextSlide = function() {
        currentSlide = (currentSlide + 1) % slideCount;
        updateCarousel();
    };

    const prevSlide = function() {
        currentSlide = (currentSlide - 1 + slideCount) % slideCount;
        updateCarousel();
    };

    const goToSlide = function(index) {
        currentSlide = index;
        updateCarousel();
    };

    const startAutoPlay = function() {
        autoPlayInterval = setInterval(nextSlide, 5000);
    };

    const stopAutoPlay = function() {
        clearInterval(autoPlayInterval);
    };

    carouselNextBtn.addEventListener("click", function() {
        stopAutoPlay();
        nextSlide();
        startAutoPlay();
    });

    carouselPrevBtn.addEventListener("click", function() {
        stopAutoPlay();
        prevSlide();
        startAutoPlay();
    });

    dots.forEach((dot) => {
        dot.addEventListener("click", function() {
            const dotIndex = parseInt(this.dataset.dot);
            stopAutoPlay();
            goToSlide(dotIndex);
            startAutoPlay();
        });
    });

    carouselTrack.addEventListener("mouseenter", stopAutoPlay);
    carouselTrack.addEventListener("mouseleave", startAutoPlay);

    document.addEventListener("keydown", function(event) {
        if (event.key === "ArrowLeft") {
            stopAutoPlay();
            prevSlide();
            startAutoPlay();
        }
        if (event.key === "ArrowRight") {
            stopAutoPlay();
            nextSlide();
            startAutoPlay();
        }
    });

    let touchStartX = 0;
    let touchEndX = 0;

    carouselTrack.addEventListener("touchstart", function(event) {
        touchStartX = event.changedTouches[0].screenX;
        stopAutoPlay();
    });

    carouselTrack.addEventListener("touchend", function(event) {
        touchEndX = event.changedTouches[0].screenX;
        handleSwipe();
        startAutoPlay();
    });

    const handleSwipe = function() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    };

    updateCarousel();
    startAutoPlay();
} else {
    console.warn("Carousel elements not found. Skipping carousel initialization.");
}

/*carousel end-----*/

/*GALLERY FILTER*/
document.addEventListener('DOMContentLoaded', function() {
    console.log('Gallery filter script loaded');
    
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    console.log('Filter buttons found:', filterBtns.length);
    console.log('Gallery items found:', galleryItems.length);

    if (filterBtns.length > 0 && galleryItems.length > 0) {
        filterBtns.forEach((btn, index) => {
            console.log('Attaching click listener to button:', btn.getAttribute('data-filter'));
            
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const filterValue = this.getAttribute('data-filter');
                console.log('Filter clicked:', filterValue);
                
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                console.log('Active button updated');
                
                // Filter gallery items
                galleryItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    
                    if (filterValue === 'all') {
                        item.style.display = 'block';
                        item.classList.remove('hidden');
                    } else {
                        if (category === filterValue) {
                            item.style.display = 'block';
                            item.classList.remove('hidden');
                        } else {
                            item.style.display = 'none';
                            item.classList.add('hidden');
                        }
                    }
                });
                console.log('Gallery items filtered');
            });
        });
    } else {
        console.error('Gallery filter elements not found');
    }
});

/*gallery filter end-----*/

/*-----------------------------------*\
  #GALLERY LIGHTBOX
\*-----------------------------------*/

document.addEventListener('DOMContentLoaded', function() {
    // Create lightbox elements
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-overlay"></div>
        <div class="lightbox-content">
            <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
            <img class="lightbox-image" src="" alt="">
        </div>
    `;
    document.body.appendChild(lightbox);

    const lightboxOverlay = lightbox.querySelector('.lightbox-overlay');
    const lightboxContent = lightbox.querySelector('.lightbox-content');
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxClose = lightbox.querySelector('.lightbox-close');

    let currentImageSrc = '';

    // Function to open lightbox
    const openLightbox = function(src) {
        currentImageSrc = src;
        lightboxImage.src = src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    };

    // Function to close lightbox
    const closeLightbox = function() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        // Clear image src after animation
        setTimeout(() => {
            lightboxImage.src = '';
        }, 300);
    };

    // Add click event to gallery images
    const galleryImages = document.querySelectorAll('.gallery-image');
    galleryImages.forEach(img => {
        img.addEventListener('click', function() {
            const src = this.src;
            openLightbox(src);
        });
    });

    // Close lightbox events
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxOverlay.addEventListener('click', closeLightbox);

    // Close on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    // Prevent closing when clicking on the image itself
    lightboxImage.addEventListener('click', function(e) {
        e.stopPropagation();
    });
});

/*lightbox end-----*/

