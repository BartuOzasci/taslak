// Hamburger menu (mobil)
const hamburger = document.getElementById("hamburger");
const navUl = document.querySelector("nav ul"); // ul elementini seçiyoruz

hamburger.addEventListener("click", () => {
  navUl.classList.toggle("active");
});

// Back to Top
const backToTop = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
  backToTop.style.display = window.scrollY > 300 ? "block" : "none";
});
backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Gallery scroll buttons
const galleryTrack = document.querySelector(".gallery-track");
document.querySelector(".gallery-btn.next").addEventListener("click", () => {
  galleryTrack.scrollBy({ left: 320, behavior: "smooth" });
});
document.querySelector(".gallery-btn.prev").addEventListener("click", () => {
  galleryTrack.scrollBy({ left: -320, behavior: "smooth" });
});

// Lightbox Modal
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxVideo = document.getElementById("lightbox-video");
const modalClose = document.querySelector(".lightbox .close");
const modalPrev = document.getElementById("modalPrev");
const modalNext = document.getElementById("modalNext");
let mediaItems = Array.from(document.querySelectorAll(".gallery-item"));
let currentIndex = -1;

function openPreview(index) {
  currentIndex = index;
  const item = mediaItems[index];
  lightboxImg.style.display = "none";
  lightboxVideo.style.display = "none";

  if (item.dataset.type === "image") {
    lightboxImg.src = item.src;
    lightboxImg.style.display = "block";
  } else {
    lightboxVideo.src = item.src;
    lightboxVideo.style.display = "block";
    lightboxVideo.play();
  }
  lightbox.style.display = "block";
  document.body.style.overflow = "hidden";
}

function closePreview() {
  lightbox.style.display = "none";
  lightboxImg.style.display = "none";
  lightboxVideo.style.display = "none";
  lightboxVideo.pause();
  document.body.style.overflow = "";
}

mediaItems.forEach((m, i) => m.addEventListener("click", () => openPreview(i)));
modalClose.addEventListener("click", closePreview);
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closePreview();
});
modalPrev.addEventListener("click", () => {
  if (currentIndex > 0) openPreview(currentIndex - 1);
});
modalNext.addEventListener("click", () => {
  if (currentIndex < mediaItems.length - 1) openPreview(currentIndex + 1);
});

// Smooth scroll for anchor links
document.querySelectorAll("a[href^='#']").forEach((a) => {
  a.addEventListener("click", (e) => {
    const href = a.getAttribute("href");
    if (href.length > 1) {
      e.preventDefault();
      document.querySelector(href).scrollIntoView({ behavior: "smooth" });
      if (mainNav.classList.contains("active")) {
        mainNav.classList.remove("active");
      }
    }
  });
});
