function toggleMenu(hamburger) {
  var sidebar = document.getElementById("sidebar");
  if (sidebar.classList.contains('closed')) {
    sidebar.classList.remove('closed');
    sidebar.classList.add('open');
  } else {
    sidebar.classList.remove('open');
    sidebar.classList.add('closed');
  }

  hamburger.classList.toggle("change");
}
