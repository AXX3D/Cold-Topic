const searchToggle = document.getElementById('searchToggle');
const searchInput = document.getElementById('searchInput');
const navLinks = document.querySelector('.navLinks');

// Toggle search bar on icon click
searchToggle.addEventListener('click', (e) => {
  const isActive = searchInput.classList.toggle('active');
  if (isActive) {
    shiftNavLeft();
    searchInput.focus();
    window.addEventListener('resize', shiftNavLeft);
  } else {
    resetNav();
    window.removeEventListener('resize', shiftNavLeft);
  }
  e.stopPropagation(); // prevent triggering document click
});

// Hide search bar when clicking outside
document.addEventListener('click', (e) => {
  if (!searchInput.contains(e.target) && !searchToggle.contains(e.target)) {
    searchInput.classList.remove('active');
    resetNav();
    window.removeEventListener('resize', shiftNavLeft);
  }
});

function shiftNavLeft() {
  if (!navLinks) return;
  // shift nav links further left when search is active
  const shift = searchInput.offsetWidth + 120;
  navLinks.style.transition = 'transform 0.3s ease';
  navLinks.style.transform = `translateX(-${shift}px)`;
}

function resetNav() {
  if (!navLinks) return;
  navLinks.style.transform = '';
  navLinks.style.transition = '';
}