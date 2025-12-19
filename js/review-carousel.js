// reviews-carousel.js
let reviewsData = null;
let currentPage = 0;
let reviewsPerPage = 4;
let totalPages = 0;
let autoplayInterval = null;
const autoplayDelay = 3500; // 3.5 seconds - faster autoplay

// Touch/swipe handling
let touchStartX = 0;
let touchEndX = 0;

// Get avatar gradient class
function getAvatarClass(index) {
    const classes = ['avatar-gradient-1', 'avatar-gradient-2', 'avatar-gradient-3', 'avatar-gradient-4'];
    return classes[index % classes.length];
}

// Calculate days ago
function getDaysAgo(createTime) {
    const now = new Date();
    const reviewDate = new Date(createTime);
    const diffTime = Math.abs(now - reviewDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

// Create star rating HTML
function getStarRating() {
    return '★★★★★';
}

// Check if mobile view
function isMobileView() {
    return window.innerWidth < 768;
}

// Update reviews per page based on screen size
function updateReviewsPerPage() {
    const width = window.innerWidth;
    if (width < 768) {
        reviewsPerPage = 1; // Mobile: 1 review
    } else if (width < 1024) {
        reviewsPerPage = 2; // Tablet: 2 reviews
    } else if (width < 1280) {
        reviewsPerPage = 3; // Laptop: 3 reviews
    } else {
        reviewsPerPage = 4; // Large Desktop: 4 reviews
    }
    
    if (reviewsData) {
        totalPages = reviewsData.reviews.length; // Total individual reviews
        // Adjust current page if needed
        if (currentPage >= totalPages) {
            currentPage = totalPages - 1;
        }
        renderReviews();
    }
}

// Get review card HTML
function getReviewCard(review, globalIndex, uniqueId, isActive = true) {
    const initial = review.reviewer.displayName.charAt(0).toUpperCase();
    const daysAgo = getDaysAgo(review.createTime);
    const opacityClass = isActive ? 'opacity-100' : 'opacity-30 pointer-events-none';
    const scaleClass = isActive ? 'scale-100' : 'scale-90';
    
    return `
        <div class="review-card bg-[#1c2025] rounded-xl p-6 flex flex-col transition-all duration-500 ${opacityClass} ${scaleClass}">
            <div class="flex items-start justify-between mb-4">
                <div class="flex items-center gap-1 text-primary text-sm">
                    ${getStarRating()} <span class="text-[#d7d8d8] text-[15px] ml-3">${daysAgo} days ago</span>
                </div>
                <div class="flex items-center gap-3">
                    <img src="img/google.svg" alt="Google" class="w-3.5 h-3.5">
                </div>
            </div>
            
            <div class="flex-1">
                <p class="text-white text-base leading-relaxed mb-4 ${review.comment.length > 200 ? 'truncate-text' : ''}" id="comment-${uniqueId}">
                    ${review.comment}
                </p>
                ${review.comment.length > 200 && isActive ? `
                    <span class="show-more-btn" onclick="toggleComment('${uniqueId}')">
                        Show more
                    </span>
                ` : ''}
            </div>
            
            <div class="flex items-center gap-3 mt-4 pt-4">
                <div class="w-10 h-10 rounded-full ${getAvatarClass(globalIndex)} flex items-center justify-center text-white font-semibold">
                    ${initial}
                </div>
                <span class="text-white font-medium">${review.reviewer.displayName}</span>
            </div>
        </div>
    `;
}

// Render reviews
function renderReviews() {
    if (!reviewsData || !reviewsData.reviews || reviewsData.reviews.length === 0) return;
    
    const container = document.getElementById('reviewsContainer');
    if (!container) return;
    
    const reviewsToShow = [];
    
    // Always show exactly reviewsPerPage reviews by looping back to start if needed
    for (let i = 0; i < reviewsPerPage; i++) {
        const reviewIndex = (currentPage + i) % totalPages;
        const review = reviewsData.reviews[reviewIndex];
        
        if (review) {
            reviewsToShow.push({
                review: review,
                globalIndex: reviewIndex,
                uniqueId: `${currentPage}-${i}`
            });
        }
    }
    
    if (reviewsToShow.length === 0) return;
    
    container.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-12 transition-opacity duration-300';
    container.style.transform = '';
    
    container.innerHTML = reviewsToShow.map(({ review, globalIndex, uniqueId }) => {
        return getReviewCard(review, globalIndex, uniqueId, true);
    }).join('');
    
    renderPagination();
}

// Toggle comment expansion
function toggleComment(uniqueId) {
    const commentEl = document.getElementById(`comment-${uniqueId}`);
    if (!commentEl) return;
    
    const isExpanded = commentEl.classList.contains('truncate-text');
    
    if (isExpanded) {
        commentEl.classList.remove('truncate-text');
        event.target.textContent = 'Show less';
    } else {
        commentEl.classList.add('truncate-text');
        event.target.textContent = 'Show more';
    }
}

// Render pagination dots
function renderPagination() {
    const dotsContainer = document.getElementById('paginationDots');
    const maxDotsToShow = isMobileView() ? 7 : 15; // More dots on desktop
    
    let dotsHTML = '';
    
    if (totalPages <= maxDotsToShow) {
        // Show all dots if total pages is less than max
        dotsHTML = Array.from({ length: totalPages }, (_, i) => {
            const isActive = i === currentPage;
            return `<div class="carousel-dot ${isActive ? 'active' : ''}" onclick="goToPage(${i})"></div>`;
        }).join('');
    } else {
        // Show dots without ellipsis - just show a range around current page
        const showDots = [];
        const range = isMobileView() ? 3 : 7;
        
        // Show pages around current page
        for (let i = Math.max(0, currentPage - range); i <= Math.min(totalPages - 1, currentPage + range); i++) {
            showDots.push(i);
        }
        
        // Create dots
        showDots.forEach(i => {
            const isActive = i === currentPage;
            dotsHTML += `<div class="carousel-dot ${isActive ? 'active' : ''}" onclick="goToPage(${i})"></div>`;
        });
    }
    
    const currentDisplay = currentPage + 1;
    
    dotsContainer.innerHTML = `
        ${dotsHTML}
        <span class="text-[#a3a3a3] text-xs ml-2 font-semibold">${currentDisplay} / ${totalPages}</span>
    `;
}

// Navigation functions
function goToPage(page) {
    currentPage = page;
    renderReviews();
    resetAutoplay();
}

function nextPage() {
    // Always move one review at a time
    currentPage = (currentPage + 1) % totalPages;
    renderReviews();
    resetAutoplay();
}

function prevPage() {
    // Always move one review at a time
    currentPage = (currentPage - 1 + totalPages) % totalPages;
    renderReviews();
    resetAutoplay();
}

// Autoplay functions
function startAutoplay() {
    stopAutoplay(); // Clear any existing interval first
    
    autoplayInterval = setInterval(() => {
        nextPage();
    }, autoplayDelay);
}

function stopAutoplay() {
    if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
    }
}

function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
}

// Touch/swipe handlers
function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
}

function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            nextPage();
            resetAutoplay();
        } else {
            prevPage();
            resetAutoplay();
        }
    }
}

// Load reviews from JSON file
async function loadReviews() {
    try {
        const response = await fetch('reviews.json');
        reviewsData = await response.json();
        updateReviewsPerPage();
        startAutoplay();
    } catch (error) {
        console.error('Error loading reviews:', error);
        document.getElementById('reviewsContainer').innerHTML = 
            '<p class="text-gray-400 col-span-4 text-center">Unable to load reviews at this time.</p>';
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    loadReviews();
    
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const reviewsContainer = document.getElementById('reviewsContainer');
    
    // Button event listeners
    nextBtn.addEventListener('click', () => {
        nextPage();
        resetAutoplay();
    });
    
    prevBtn.addEventListener('click', () => {
        prevPage();
        resetAutoplay();
    });
    
    // Pause autoplay on hover
    reviewsContainer.addEventListener('mouseenter', stopAutoplay);
    reviewsContainer.addEventListener('mouseleave', startAutoplay);
    
    // Touch/swipe event listeners
    reviewsContainer.addEventListener('touchstart', handleTouchStart, false);
    reviewsContainer.addEventListener('touchend', handleTouchEnd, false);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevPage();
            resetAutoplay();
        }
        if (e.key === 'ArrowRight') {
            nextPage();
            resetAutoplay();
        }
    });
    
    // Update on window resize
    window.addEventListener('resize', updateReviewsPerPage);
});

// Make functions globally available
window.toggleComment = toggleComment;
window.goToPage = goToPage;
window.nextPage = nextPage;
window.prevPage = prevPage;