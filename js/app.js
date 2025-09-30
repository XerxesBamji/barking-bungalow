document.addEventListener('DOMContentLoaded', function () {
  const reviewElements = Array.from(document.querySelectorAll('.review1, .review2, .review3'));
  if (reviewElements.length === 0) return;

  let currentIndex = reviewElements.findIndex(function (el) {
    return !el.classList.contains('hidden');
  });
  if (currentIndex === -1) currentIndex = 0;

  function showReview(index) {
    reviewElements.forEach(function (el, i) {
      if (i === index) {
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    });
  }

  document.addEventListener('click', function (event) {
    const icon = event.target.closest('.fa-arrow-left, .fa-arrow-right');
    if (!icon) return;

    const withinReview = icon.closest('.review1, .review2, .review3');
    if (!withinReview) return;

    event.preventDefault();

    if (icon.classList.contains('fa-arrow-right')) {
      currentIndex = (currentIndex + 1) % reviewElements.length;
    } else if (icon.classList.contains('fa-arrow-left')) {
      currentIndex = (currentIndex - 1 + reviewElements.length) % reviewElements.length;
    }

    showReview(currentIndex);
  });
});

const button = document.querySelector('#menu-button');
const menu = document.querySelector('#menu');


button.addEventListener('click', () => {
  menu.classList.toggle('hidden');
});