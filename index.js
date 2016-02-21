var flickrUrl = "https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=02463078aaf5cf079bb47c1745a278f2&photoset_id=72157647299892609&user_id=41497208%40N04&per_page=20&page=1&media=photos&format=json&nojsoncallback=1",
  images = [], // Array of all images shown in grid
  currentImageIndex = 0, // Index of image in lightbox
  imagesDiv = document.getElementById('images'),
  lightbox = document.getElementsByClassName('lightbox')[0],
  imageTitle = document.getElementsByClassName('lightbox-title')[0],
  prevArrow = document.getElementsByClassName('prev-arrow')[0],
  nextArrow = document.getElementsByClassName('next-arrow')[0],
  lightboxExit = document.getElementsByClassName('lightbox-exit')[0],
  lightboxImage = document.getElementsByClassName('lightbox-image')[0],
  lightboxBackground = document.getElementsByClassName('lightbox-background')[0];

setupEventListeners();
callImageApi(flickrUrl);  

function setupEventListeners() {
  prevArrow.addEventListener('click', loadPrevImage, false);
  nextArrow.addEventListener('click', loadNextImage, false);
  lightboxBackground.addEventListener('click', closeLightbox, false);
  lightboxExit.addEventListener('click', closeLightbox, false);
}

function callImageApi(url) {
  var xhr = new XMLHttpRequest();
  xhr.addEventListener("load", displayImages, false);
  xhr.open('GET', url, true);
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
}

function loadPrevImage() {
  loadLightbox(currentImageIndex - 1);
}

function loadNextImage() {
  loadLightbox(currentImageIndex + 1);
}

function loadLightbox(index) {
  currentImageIndex = index;
  lightbox.style.display = "block";
  lightboxBackground.style.display = "block";
  lightboxImage.src = getImageUrl(index, false);

  prevArrow.style.display = (index > 0) ? "block" : "none";
  nextArrow.style.display = (index < images.length - 1) ? "block" : "none";
  imageTitle.innerHTML = getImageTitle(index);
}

function closeLightbox() {
  lightbox.style.display = "none";
  lightboxBackground.style.display = "none";
}

function getImageUrl(imageIndex, useThumbnailVersion) {
  var image = images[imageIndex];
  var flickrThumbnailId = "q"; // Flickr uses "q" suffix for thumbnail size
  var flickrLargeSizeId = "c"; // Flickr uses "c" suffic for large size
  var size = (useThumbnailVersion === true) ? flickrThumbnailId : flickrLargeSizeId;
  return "https://farm" + image.farm + 
    ".staticflickr.com/" + image.server + "/" + image.id + "_" + image.secret + "_" + size + ".jpg";
}

function getImageTitle(imageIndex) {
  var image = images[imageIndex];
  return image.title;
}
