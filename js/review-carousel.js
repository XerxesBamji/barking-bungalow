// reviews-carousel.js
let reviewsData = null;
let currentPage = 0;
const reviewsPerPage = 4;
let totalPages = 0;
let autoplayInterval = null;
const autoplayDelay = 6000; // 6 seconds

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

// Render reviews
function renderReviews() {
    if (!reviewsData) return;
    
    const container = document.getElementById('reviewsContainer');
    const startIndex = currentPage * reviewsPerPage;
    const endIndex = startIndex + reviewsPerPage;
    const reviewsToShow = reviewsData.reviews.slice(startIndex, endIndex);
    
    container.innerHTML = reviewsToShow.map((review, index) => {
        const globalIndex = startIndex + index;
        const initial = review.reviewer.displayName.charAt(0).toUpperCase();
        const daysAgo = getDaysAgo(review.createTime);
        
        return `
            <div class="review-card bg-[#1c2025] rounded-xl p-6 flex flex-col">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex items-center gap-1 text-primary text-sm">
                        ${getStarRating()} <span class="text-[#d7d8d8] text-[15px] ml-3">${daysAgo} days ago</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <img src="img/google.svg" alt="Google" class="w-3.5 h-3.5">
                    </div>
                </div>
                
                <div class="flex-1">
                    <p class="text-white text-base leading-relaxed mb-4 ${review.comment.length > 200 ? 'truncate-text' : ''}" id="comment-${globalIndex}">
                        ${review.comment}
                    </p>
                    ${review.comment.length > 200 ? `
                        <span class="show-more-btn" onclick="toggleComment(${globalIndex})">
                            Show more
                        </span>
                    ` : ''}
                </div>
                
                <div class="flex items-center gap-3 mt-4 pt-6">
                    <div class="w-10 h-10 rounded-full ${getAvatarClass(globalIndex)} flex items-center justify-center text-white font-light text-xl">
                        ${initial}
                    </div>
                    <span class="text-white font-medium">${review.reviewer.displayName}</span>
                </div>
            </div>
        `;
    }).join('');
    
    renderPagination();
}

// Toggle comment expansion
function toggleComment(index) {
    const commentEl = document.getElementById(`comment-${index}`);
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
    const dots = Array.from({ length: totalPages }, (_, i) => {
        return `<div class="carousel-dot ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})"></div>`;
    }).join('');
    
    dotsContainer.innerHTML = `
        ${dots}
        <span class="text-[#a3a3a3] text-xs ml-2 font-semibold">${currentPage + 1} / ${totalPages}</span>
    `;
}

// Navigation functions
function goToPage(page) {
    currentPage = page;
    renderReviews();
    resetAutoplay(); // Reset autoplay timer when manually navigating
}

function nextPage() {
    if (currentPage < totalPages - 1) {
        currentPage++;
    } else {
        currentPage = 0; // Loop back to first page
    }
    renderReviews();
}

function prevPage() {
    if (currentPage > 0) {
        currentPage--;
    } else {
        currentPage = totalPages - 1; // Loop to last page
    }
    renderReviews();
}

// Autoplay functions
function startAutoplay() {
    if (autoplayInterval) return; // Don't start if already running
    
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

// Load reviews from JSON file
async function loadReviews() {
    try {
        const response = await fetch('reviews.json'); // Adjust path if needed
        reviewsData = await response.json();
        totalPages = Math.ceil(reviewsData.reviews.length / reviewsPerPage);
        renderReviews();
        startAutoplay(); // Start autoplay after loading reviews
    } catch (error) {
        console.error('Error loading reviews:', error);
        document.getElementById('reviewsContainer').innerHTML = 
            '<p class="text-primary col-span-4 text-center">Unable to load reviews at this time.</p>';
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Load reviews
    loadReviews();
    
    // Event listeners
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    
    nextBtn.addEventListener('click', () => {
        nextPage();
        resetAutoplay(); // Reset autoplay when user interacts
    });
    
    prevBtn.addEventListener('click', () => {
        prevPage();
        resetAutoplay(); // Reset autoplay when user interacts
    });
    
    // Pause autoplay on hover
    const reviewsContainer = document.getElementById('reviewsContainer');
    reviewsContainer.addEventListener('mouseenter', stopAutoplay);
    reviewsContainer.addEventListener('mouseleave', startAutoplay);
    
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
});

// Make functions globally available
window.toggleComment = toggleComment;
window.goToPage = goToPage;
window.nextPage = nextPage;
window.prevPage = prevPage;