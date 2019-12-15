var videos = document.querySelectorAll(".item video");

for (var i = 0; i < videos.length; i++) {
  videos[i].addEventListener('mouseover', function(event) {
    event.target.play();
  });

  videos[i].addEventListener('mouseout', function(event) {
    event.target.pause();
  });
}