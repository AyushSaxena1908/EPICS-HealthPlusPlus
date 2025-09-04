document.addEventListener("DOMContentLoaded", () => {
  // Payment logic
  const paymentLink499 = "https://razorpay.me/@health707";
  const paymentLink999 = "https://razorpay.me/@health707";
  const subscribeButtons = document.querySelectorAll(".right button");
  subscribeButtons.forEach(button => {
    button.addEventListener("click", () => {
      if (button.textContent.includes("₹499")) {
        window.location.href = paymentLink499;
      } else if (button.textContent.includes("₹999")) {
        window.location.href = paymentLink999;
      }
    });
  });

  // Review system with localStorage
  document.querySelectorAll(".card").forEach((card, index) => {
    let selectedRating = 0;
    const stars = card.querySelectorAll(".star");
    const input = card.querySelector(".review-input");
    const submitBtn = card.querySelector(".submit-review");
    const viewBtn = card.querySelector(".view-reviews");
    const allReviews = card.querySelector(".all-reviews");
    const doctorKey = `doctor_reviews_${index}`;
    const doctorName = card.querySelector(".left h2").textContent;

    // Load existing reviews from localStorage
    const savedReviews = JSON.parse(localStorage.getItem(doctorKey)) || [];
    
    // Star click behavior
    stars.forEach(star => {
      star.addEventListener("click", () => {
        selectedRating = parseInt(star.dataset.rating);
        stars.forEach(s => {
          s.classList.toggle("selected", parseInt(s.dataset.rating) <= selectedRating);
        });
      });
    });

    // Submit review and save
    submitBtn?.addEventListener("click", () => {
      const reviewText = input.value.trim();
      if (reviewText && selectedRating > 0) {
        const newReview = { rating: selectedRating, text: reviewText, date: new Date().toLocaleDateString() };
        
        // Save to localStorage
        savedReviews.push(newReview);
        localStorage.setItem(doctorKey, JSON.stringify(savedReviews));
        
        input.value = "";
        selectedRating = 0;
        stars.forEach(s => s.classList.remove("selected"));
        
        alert("Review submitted successfully!");
      } else {
        alert("Please give a star rating and write a review.");
      }
    });

    // View Reviews button functionality
    viewBtn?.addEventListener("click", () => {
      const popupOverlay = document.querySelector(".popup-overlay");
      const popupReviews = document.querySelector(".popup-reviews");
      
      // Clear previous reviews
      popupReviews.innerHTML = "";
      
      // Add doctor name to header
      document.querySelector(".popup-header h3").textContent = `All Reviews for ${doctorName}`;
      
      // Populate with reviews
      if (savedReviews.length > 0) {
        savedReviews.forEach(review => {
          popupReviews.innerHTML += `
            <div class="review-item">
              <p><strong>Rating:</strong> ${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}</p>
              <p><strong>Review:</strong> ${review.text}</p>
              <p><small>Date: ${review.date || 'Unknown'}</small></p>
            </div>
          `;
        });
      } else {
        popupReviews.innerHTML = `<div class="no-reviews">No reviews yet</div>`;
      }
      
      // Display popup
      popupOverlay.style.display = "flex";
    });
  });

  // Close popup when clicking X or outside the popup
  document.querySelector(".popup-close").addEventListener("click", () => {
    document.querySelector(".popup-overlay").style.display = "none";
  });
  
  document.querySelector(".popup-overlay").addEventListener("click", (e) => {
    if (e.target === document.querySelector(".popup-overlay")) {
      document.querySelector(".popup-overlay").style.display = "none";
    }
  });
});