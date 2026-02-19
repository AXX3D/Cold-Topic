const searchToggle = document.getElementById('searchToggle');
const searchInput = document.getElementById('searchInput');

// Toggle search bar on icon click
searchToggle.addEventListener('click', (e) => {
  searchInput.classList.toggle('active');
  if (searchInput.classList.contains('active')) {
    searchInput.focus();
  }
  e.stopPropagation(); // prevent triggering document click
});

// Hide search bar when clicking outside
document.addEventListener('click', (e) => {
  if (!searchInput.contains(e.target) && !searchToggle.contains(e.target)) {
    searchInput.classList.remove('active');
  }
});