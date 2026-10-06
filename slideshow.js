let slideIndex = 0;
carousel();

function carousel() {
  const slides = document.querySelectorAll(".mySlides");

  slides.forEach(slide => {
    slide.style.display = "none";
  });

  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}
  slides[slideIndex - 1].style.display = "block";

  setTimeout(carousel, 2000);
}