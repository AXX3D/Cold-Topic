const searchToggle = document.getElementById('searchToggle');
const searchInput = document.getElementById('searchInput');

function positionSearchUnderToggle() {
  const rect = searchToggle.getBoundingClientRect();
  searchInput.style.position = 'absolute';
  searchInput.style.left = (rect.left + window.scrollX) + 'px';
  searchInput.style.top = (rect.bottom + window.scrollY) + 'px';
  searchInput.style.zIndex = '1000';
  // match toggle width or set a minimum width
  searchInput.style.minWidth = Math.max(rect.width, 200) + 'px';
}

searchToggle.addEventListener('click', (e) => {
  const isActive = searchInput.classList.toggle('active');
  if (isActive) {
    positionSearchUnderToggle();
    searchInput.focus();
    window.addEventListener('resize', positionSearchUnderToggle);
    window.addEventListener('scroll', positionSearchUnderToggle, true);
  } else {
    // clear inline styles when hidden
    searchInput.style.position = '';
    searchInput.style.left = '';
    searchInput.style.top = '';
    searchInput.style.zIndex = '';
    searchInput.style.minWidth = '';
    window.removeEventListener('resize', positionSearchUnderToggle);
    window.removeEventListener('scroll', positionSearchUnderToggle, true);
  }
  e.stopPropagation();
});

document.addEventListener('click', (e) => {
  if (!searchInput.contains(e.target) && !searchToggle.contains(e.target)) {
    searchInput.classList.remove('active');
    searchInput.style.position = '';
    searchInput.style.left = '';
    searchInput.style.top = '';
    searchInput.style.zIndex = '';
    searchInput.style.minWidth = '';
    window.removeEventListener('resize', positionSearchUnderToggle);
    window.removeEventListener('scroll', positionSearchUnderToggle, true);
  }
});