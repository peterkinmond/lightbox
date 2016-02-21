var flickrUrl = "https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=02463078aaf5cf079bb47c1745a278f2&photoset_id=72157647299892609&user_id=41497208%40N04&per_page=20&page=1&media=photos&format=json&nojsoncallback=1",
  images = [], // Array of all images shown in grid
  imagesDiv = document.getElementById('images'),
  lightbox = document.getElementsByClassName('lightbox')[0],
  lightboxImage = document.getElementsByClassName('lightbox-image')[0],
  lightboxBackground = document.getElementsByClassName('lightbox-background')[0];

callImageApi(flickrUrl);

function callImageApi(url) {
  var xhr = new XMLHttpRequest();
  xhr.addEventListener("load", imageApiCallback, false);
  xhr.open('GET', url, true);
  xhr.send();
}

function imageApiCallback() {
  var data = JSON.parse(this.responseText);
  images = data.photoset.photo; // Flickr calls the array of photos "photo"
  displayImages(images);
}

function displayImages(images) {
  images.forEach(function(image, index) {
    var imageContainer = document.createElement('div');
    imageContainer.style.backgroundImage = "url(" + getImageUrl(index, true) + ")";
    imageContainer.className = "image-container";
    imageContainer.addEventListener('click', function() { loadLightbox(index); }, false);
    imageContainer.dataset.index = index;
    imagesDiv.appendChild(imageContainer);
  });
}

function loadLightbox(index) {
  lightbox.style.display = "block";
  lightboxBackground.style.display = "block";
  lightboxImage.src = getImageUrl(index, false);
}

function getImageUrl(imageIndex, useThumbnailVersion) {
  var image = images[imageIndex];
  var flickrThumbnailId = "q"; // Flickr uses "q" suffix for thumbnail size
  var flickrLargeSizeId = "c"; // Flickr uses "c" suffic for large size
  var size = (useThumbnailVersion === true) ? flickrThumbnailId : flickrLargeSizeId;
  return "https://farm" + image.farm + 
    ".staticflickr.com/" + image.server + "/" + image.id + "_" + image.secret + "_" + size + ".jpg";
}
