
let currentSlide = -1;
let totalSlides = -1;

function lightbox() {
  return document.getElementById("lightbox");
}

function toc() {
  return document.getElementById("toc");
}

function getImagesInRow(imgElem) {
  const imgs = [];
  const row = imgElem.parentElement.parentElement;
  const imgElems = row.getElementsByTagName('img');
  for (let i = 0; i < imgElems.length; ++i) {
    imgs.push(imgElems[i].src);
  }
  return imgs;
}

function loadLightbox(imgElem) {
  const images = getImagesInRow(imgElem);
  populateLightBox(images, images.indexOf(imgElem.src));
  showLightbox();
}

function showLightbox() {
  lightbox().style.display = "block";
  lightbox().hidden = false;
  toc().hidden = true;
  disableScroll();
}

function hideLightBox() {
  lightbox().style.display = "none";
  lightbox().hidden = true;
  toc().hidden = false;
  enableScroll();
}

function populateLightBox(images, i) {
  totalSlides = images.length;
  currentSlide = Math.min(Math.max(1, i+1), totalSlides);

  let contentHtml = '';
  let thumbnailHtml = '';

  for (let j = 0; j < images.length; ++j) {
    contentHtml += `
    <div class="mySlides">
      <div class="numbertext">${j+1} / ${totalSlides}</div>
      <img src="${images[j]}" style="width:100%" />
    </div>
    `;

    thumbnailHtml += `
      <div class="thumbnailContainer">
        <img 
          class="demo" 
          src="${images[j]}" 
          onclick="showSlide(${j+1})"
          alt=""
        >
      </div>
    `;
  }

  const content = document.getElementById('lightbox-content');
  content.innerHTML = contentHtml;

  const thumbnails = document.getElementById('lightbox-thumbnails');
  thumbnails.innerHTML = thumbnailHtml;

  showCurrentSlide();
}

function plusSlides(i) {
  currentSlide = Math.min(Math.max(1, currentSlide+i), totalSlides);
  showCurrentSlide();
}

function showCurrentSlide() {
  const slides = document.getElementsByClassName("mySlides");
  const dots = document.getElementsByClassName("demo");
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (let i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[currentSlide-1].style.display = "block";
  dots[currentSlide-1].className += " active";
}

function showSlide(i) {
  currentSlide = Math.min(Math.max(1, i), totalSlides);
  showCurrentSlide();
}

function setImageWidths() {
  function setWidth(row) {
    const imgElems = row.getElementsByClassName('column');
    const imgCount = imgElems.length;
    for (let i = 0; i < imgElems.length; ++i) {
      imgElems[i].style.width = `${Math.trunc(100/imgCount)-2}%` ;
    }
  }
  const rows = document.getElementsByClassName('row');
  for (let i = 0; i < rows.length; ++i) {
    setWidth(rows[i]);
  }
}

setImageWidths();

// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefault(e) {
  e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
  if (keys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
}

// modern Chrome requires { passive: false } when adding event
let supportsPassive = false;
try {
  window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
    get: function () { supportsPassive = true; }
  }));
} catch(e) {}

let wheelOpt = supportsPassive ? { passive: false } : false;
let wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

// call this to Disable
function disableScroll() {
  window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
  window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
  window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
  window.addEventListener('keydown', preventDefaultForScrollKeys, false);
}

// call this to Enable
function enableScroll() {
  window.removeEventListener('DOMMouseScroll', preventDefault, false);
  window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
  window.removeEventListener('touchmove', preventDefault, wheelOpt);
  window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
}

