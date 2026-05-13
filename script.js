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

let currentSlide = 0;
let autoPlayInterval;
const slideCount = carouselSlides.length;

// Update carousel position
const updateCarousel = function() {
    // Translate carousel track to show current slide
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

// Next slide
const nextSlide = function() {
    currentSlide = (currentSlide + 1) % slideCount;
    updateCarousel();
};

// Previous slide
const prevSlide = function() {
    currentSlide = (currentSlide - 1 + slideCount) % slideCount;
    updateCarousel();
};

// Go to specific slide
const goToSlide = function(index) {
    currentSlide = index;
    updateCarousel();
};

// Auto play
const startAutoPlay = function() {
    autoPlayInterval = setInterval(nextSlide, 5000);
};

const stopAutoPlay = function() {
    clearInterval(autoPlayInterval);
};

// Event listeners for buttons
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

// Event listeners for dots
dots.forEach((dot) => {
    dot.addEventListener("click", function() {
        const dotIndex = parseInt(this.dataset.dot);
        stopAutoPlay();
        goToSlide(dotIndex);
        startAutoPlay();
    });
});

// Mouse hover to pause auto play
carouselTrack.addEventListener("mouseenter", stopAutoPlay);
carouselTrack.addEventListener("mouseleave", startAutoPlay);

// Keyboard navigation
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

// Touch/Swipe support for mobile
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

// Initialize carousel
updateCarousel();
startAutoPlay();

/*carousel end-----*/


