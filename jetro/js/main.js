document.addEventListener('DOMContentLoaded', () => {
    let active_slide = document.querySelector('.header-hero-slider-active > img');
    let slider_thumbnails = document.querySelectorAll('.header-hero-slider-thumbs img');

    let removeActiveThumbs = () => {
        slider_thumbnails.forEach((item, index) => {
            item.parentNode.classList.remove('header-hero-slider-thubm-block-active');
        });
    }

    slider_thumbnails.forEach((item, index) => {
        item.addEventListener('click', () => {
            active_slide.setAttribute('src', item.getAttribute('src'));
            removeActiveThumbs();
            item.parentNode.classList.add('header-hero-slider-thubm-block-active');
        });
    });
});