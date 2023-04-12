const deleteTravelBtn = document.getElementById('deleteTravel')
const deleteTravelForm = document.getElementById('deleteForm');

// Manully delete Travel item 
deleteTravelBtn.addEventListener('click', (e) => {
    e.preventDefault();
    deleteTravelForm.submit();
})

