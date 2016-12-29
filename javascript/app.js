/**
 * @author Kushtrim Abdiu
 * this is the app controller
 */

/**
 * bool
 */
 let startGalery = false;

 let allPhotos = [];

 let galleryPhotos = [];

/**
 * 
 */
 const photosDiv = document.getElementById('photos_div');

/**
 * 
 */
 const thumbnailDiv = document.getElementById('photos_thumbnail');

 /**
  * 
  */
  const viewGalleryDiv = document.getElementById('divShowButton');

  /**
   * 
   */
  const searchDiv = document.getElementById('search_container');

  let galleryPhotoNr = 0;

/**
 * appLoaded - triggered when the application loads
 */
appLoaded = () => {
    
}

/**
 * searchForPictures - triggered when the button Search is clicked
 */
searchForPictures = () => {
    const userInput = document.getElementById('searchInput').value;
    const flickr = new Flickr();
    flickr.search(userInput, function(photos) {
        allPhotos = photos;
        showPhotos(photos);
    });
}

/**
 * showPhotos 
 * @param {Array} photos
 * @return void
 */
showPhotos = (photos) => {
    let html = "";

    for (let photo of photos) {
        html += "<div class = 'col-md-4 col-sm-12'>";
        html +=     "<div class = 'thumbnail'>";
        html +=         `<img src = '${photo.img}' class = "picture" />`;
        html +=         "<div class = 'caption'>";
        html +=             `<h5>${photo.title}</h5>`;
        html +=             `<p><a class = 'btn btn-primary' onclick = 'addToGallery("${photo.id}", "${photo.img}")' role = 'button'>Add To Gallery</a></p>`;
        html +=         "</div>";
        html +=     "</div>";
        html += "</div>";
    }

    //inject photos into the html
    photosDiv.innerHTML = html;
}

addToGallery = (id, img) => {
    if (!startGalery) {
        startGalery = true;
        showCheckoutGalleryButton()
    }

    const imgObject = { id : id, img : img};
    if (!itemExistsInGallery(imgObject)) {
        galleryPhotos.push(imgObject);
        galleryPhotoNr++;
        document.getElementById('counter_span').innerHTML = galleryPhotoNr.toString();
    }
}

showCheckoutGalleryButton = () => {
    const viewGalleryButton = "<button  class = 'btn btn-primary btnGallery' onclick = 'showGallery()' role = 'button'><span id = 'counter_span' class = 'badge'>&nbsp&nbsp&nbsp</span>&nbspGallery</button>";
    viewGalleryDiv.innerHTML += viewGalleryButton;
}

itemExistsInGallery = (obj) => {
    for (let photo of galleryPhotos) {
        if (photo.id == obj.id) {
            return true;
        }
    }

    return false;
}

showGallery = () => {
    //we have to clear the photos_div and show the gallery instead
    photosDiv.innerHTML = "";
    viewGalleryDiv.innerHTML = "<a  class = 'btn btn-primary btnGallery' onclick = 'showGallery()' role = 'button'>Go back to search</a>";
    searchDiv.innerHTML = "";
    
    initiateThumbnail();
}

initiateThumbnail = () => {
    photosDiv.innerHTML = `<center><img src = "${galleryPhotos[0].img}" class = "bigPicture"></center>`;
    thumbnailHTML = ""
    for (let photo of galleryPhotos) {
        thumbnailHTML += `<div class = 'col-xs-1 col-md-1' onclick = 'showPhoto("${photo.img}")'>`;
        thumbnailHTML += "<a href = '#' class = 'thumbnail photoThumbnail'>";
        thumbnailHTML += `<img src = "${photo.img}" alt = "Photo">`;
        thumbnailHTML += "</a></div>";
    }

    thumbnailDiv.innerHTML = thumbnailHTML;
}

showPhoto = (img) => {
    photosDiv.innerHTML = `<center><img src = "${img}" class = "bigPicture"></center>`;
}