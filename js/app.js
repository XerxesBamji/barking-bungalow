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

    // pause auto on manual interaction
    stopAuto();

    if (icon.classList.contains('fa-arrow-right')) {
      currentIndex = (currentIndex + 1) % reviewElements.length;
    } else if (icon.classList.contains('fa-arrow-left')) {
      currentIndex = (currentIndex - 1 + reviewElements.length) % reviewElements.length;
    }

    showReview(currentIndex);
    startAutoSoon();
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
      stopAuto();
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
      if (Math.abs(dy) > VERTICAL_TOLERANCE_PX) { startAutoSoon(); return; }

      if (dx <= -SWIPE_THRESHOLD_PX) {
        // swipe left -> next
        currentIndex = (currentIndex + 1) % reviewElements.length;
        showReview(currentIndex);
      } else if (dx >= SWIPE_THRESHOLD_PX) {
        // swipe right -> prev
        currentIndex = (currentIndex - 1 + reviewElements.length) % reviewElements.length;
        showReview(currentIndex);
      }
      startAutoSoon();
    });

    // Pause on hover (desktop) and resume on leave
    swipeContainer.addEventListener('mouseenter', stopAuto);
    swipeContainer.addEventListener('mouseleave', startAutoSoon);
  }

  // Auto-advance carousel
  var autoTimer = null;
  var AUTO_MS = 5000; // time between slides
  var RESUME_DELAY_MS = 2500; // delay after interaction before resuming

  function nextSlide() {
    currentIndex = (currentIndex + 1) % reviewElements.length;
    showReview(currentIndex);
  }

  function startAuto() {
    if (autoTimer) return;
    autoTimer = setInterval(nextSlide, AUTO_MS);
  }

  function stopAuto() {
    if (!autoTimer) return;
    clearInterval(autoTimer);
    autoTimer = null;
  }

  var resumeTimer = null;
  function startAutoSoon() {
    if (resumeTimer) { clearTimeout(resumeTimer); }
    resumeTimer = setTimeout(function () {
      startAuto();
    }, RESUME_DELAY_MS);
  }

  // Also pause when page is hidden to save resources
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      stopAuto();
    } else {
      startAutoSoon();
    }
  });

  // Kick off auto-play
  startAuto();
});

const button = document.querySelector('#menu-button');
const menu = document.querySelector('#menu');
const closeButton = document.querySelector('#close-menu');

// Add backdrop overlay for mobile sidebar
const backdrop = document.createElement('div');
backdrop.className = 'fixed inset-0 bg-black bg-opacity-50 z-40 hidden';
document.body.appendChild(backdrop);

function openSidebar() {
  menu.classList.remove('translate-x-full');
  backdrop.classList.remove('hidden');
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeSidebar() {
  menu.classList.add('translate-x-full');
  backdrop.classList.add('hidden');
  document.body.style.overflow = ''; // Restore scrolling
}

button.addEventListener('click', () => {
  openSidebar();
});

closeButton.addEventListener('click', () => {
  closeSidebar();
});

backdrop.addEventListener('click', () => {
  closeSidebar();
});

// Close sidebar when clicking on links
const sidebarLinks = menu.querySelectorAll('a');
sidebarLinks.forEach(link => {
  link.addEventListener('click', () => {
    closeSidebar();
  });
});