const reviewForm = document.getElementById('reviewForm');
const starSelect = document.getElementById('starSelect');

// Allow for 0 value rating in review form 
reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = document.querySelector('input[name="review[rating]"]:checked').value;
    
    if (val == 0) {
        starSelect.classList.add('d-block')
    } else {
        starSelect.classList.remove('d-block');
        reviewForm.submit();
    }
})