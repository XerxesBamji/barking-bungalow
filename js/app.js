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

  // Touch swipe support for mobile
  var touchStartX = 0;
  var touchStartY = 0;
  var touchEndX = 0;
  var touchEndY = 0;
  var isSwiping = false;
  var SWIPE_THRESHOLD_PX = 40; // min horizontal movement to trigger
  var VERTICAL_TOLERANCE_PX = 60; // ignore if mostly vertical

  // Use a stable container to attach listeners (parent of the review blocks)
  var swipeContainer = reviewElements[0] && reviewElements[0].parentElement;
  if (swipeContainer) {
    swipeContainer.addEventListener('touchstart', function (e) {
      if (!e.touches || e.touches.length === 0) return;
      var t = e.touches[0];
      touchStartX = t.clientX;
      touchStartY = t.clientY;
      touchEndX = touchStartX;
      touchEndY = touchStartY;
      isSwiping = true;
    }, { passive: true });

    swipeContainer.addEventListener('touchmove', function (e) {
      if (!isSwiping || !e.touches || e.touches.length === 0) return;
      var t = e.touches[0];
      touchEndX = t.clientX;
      touchEndY = t.clientY;
    }, { passive: true });

    swipeContainer.addEventListener('touchend', function () {
      if (!isSwiping) return;
      var dx = touchEndX - touchStartX;
      var dy = touchEndY - touchStartY;
      isSwiping = false;

      // Ignore vertical swipes
      if (Math.abs(dy) > VERTICAL_TOLERANCE_PX) return;

      if (dx <= -SWIPE_THRESHOLD_PX) {
        // swipe left -> next
        currentIndex = (currentIndex + 1) % reviewElements.length;
        showReview(currentIndex);
      } else if (dx >= SWIPE_THRESHOLD_PX) {
        // swipe right -> prev
        currentIndex = (currentIndex - 1 + reviewElements.length) % reviewElements.length;
        showReview(currentIndex);
      }
    });
  }
});

const button = document.querySelector('#menu-button');
const menu = document.querySelector('#menu');


button.addEventListener('click', () => {
  menu.classList.toggle('hidden');
});