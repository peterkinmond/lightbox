var images = [], // Array of all images shown in grid
  currentImageIndex = 0, // Index of image in lightbox
  imagesDiv = document.querySelector('#images'),
  lightbox = document.querySelector('.lightbox'),
  imageTitle = document.querySelector('.lightbox-title'),
  prevArrow = document.querySelector('.prev-arrow'),
  nextArrow = document.querySelector('.next-arrow'),
  lightboxExit = document.querySelector('.lightbox-exit'),
  lightboxImage = document.querySelector('.lightbox-image'),
  lightboxBackground = document.querySelector('.lightbox-background'),
  loadingGif = document.querySelector('.loading'),
  lightboxFooter = document.querySelector('.lightbox-footer');

setupEventListeners();
callImageApi();  

function setupEventListeners() {
  prevArrow.addEventListener('click', loadPrevImage, false);
  nextArrow.addEventListener('click', loadNextImage, false);
  lightboxBackground.addEventListener('click', closeLightbox, false);
  lightboxExit.addEventListener('click', closeLightbox, false);
}

function callImageApi() {
  var flickrUrl = "https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=02463078aaf5cf079bb47c1745a278f2&photoset_id=72157647923665573&user_id=99265791%40N00&per_page=20&page=1&media=photos&format=json&nojsoncallback=1";
  var xhr = new XMLHttpRequest();
  xhr.addEventListener("load", displayImages, false);
  xhr.open('GET', flickrUrl, true);
  xhr.send();
}

function displayImages() {
  var data = JSON.parse(this.responseText);
  images = data.photoset.photo; // Flickr calls the array of photos "photo"

  images.forEach(function(image, index) {
    var imageContainer = document.createElement('div');
    imageContainer.style.backgroundImage = "url(" + getImageUrl(index, true) + ")";
    imageContainer.className = "image-container";
    imageContainer.addEventListener('click', function() { loadLightbox(index); }, false);
    imageContainer.dataset.index = index;
    imagesDiv.appendChild(imageContainer);
  });

  loadingGif.style.display = "none";
}

function loadPrevImage() {
  loadLightbox(currentImageIndex - 1);
}

function loadNextImage() {
  loadLightbox(currentImageIndex + 1);
}

function loadLightbox(index) {
  loadingGif.style.display = "block";
  currentImageIndex = index;
  lightboxBackground.style.display = "block";

  var img = new Image();
  img.addEventListener('load', loadLightboxImage, false);
  img.src = getImageUrl(index, false);
}

function loadLightboxImage() { 
  // Check image/window dimensions to size image correctly
  var imageRatio = this.width/this.height;
  var windowRatio = window.innerWidth/window.innerHeight;
  var widthIsLarger = imageRatio > windowRatio;

  lightbox.style.height = widthIsLarger ? "auto" : "80%";
  lightbox.style.width  = widthIsLarger ? "80%"  : "auto";
  lightboxImage.style.height = widthIsLarger ? "auto" : "100%";
  lightboxImage.style.width  = widthIsLarger ? "100%" : "auto";
  lightboxImage.src = getImageUrl(currentImageIndex, false);
  lightbox.style.display = "block";
  lightboxFooter.style.display = "block";

  prevArrow.style.display = (currentImageIndex > 0) ? "block" : "none";
  nextArrow.style.display = (currentImageIndex < images.length - 1) ? "block" : "none";
  imageTitle.innerHTML = getImageTitle();
  loadingGif.style.display = "none";
}

function closeLightbox() {
  lightbox.style.display = "none";
  lightboxBackground.style.display = "none";
  lightboxFooter.style.display = "none";
}

function getImageUrl(imageIndex, useThumbnailVersion) {
  var image = images[imageIndex];
  var flickrThumbnailId = "q"; // Flickr uses "q" suffix for thumbnail size
  var flickrLargeSizeId = "c"; // Flickr uses "c" suffic for large size
  var size = (useThumbnailVersion === true) ? flickrThumbnailId : flickrLargeSizeId;
  return "https://farm" + image.farm + 
    ".staticflickr.com/" + image.server + "/" + image.id + "_" + image.secret + "_" + size + ".jpg";
}

function getImageTitle() {
  var image = images[currentImageIndex];
  return image.title;
}
