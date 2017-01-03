/**
 * @author Kushtrim Abdiu
 * this is the app controller
 */

/**
 * initiate global variables
 */
 let startGalery = false, allPhotos = [], galleryPhotos = [], galleryPhotoNr = 0, selectedPage;

/**
 * reference the DOM elements from the view
 */
 const photosDiv        = document.getElementById('photos_div');
 
 const thumbnailDiv     = document.getElementById('photos_thumbnail');
 
 const viewGalleryDiv   = document.getElementById('divShowButton');
 
 const searchDiv        = document.getElementById('search_container');


/**
 * appLoaded - triggered when the application loads
 */
appLoaded = () => {
    //focus the cursor on the search input
    document.getElementById("searchInput").focus();
}

/**
 * searchForPictures - triggered when the button Search is clicked
 */
searchForPictures = () => {
    //add the loader image to indicate that the searching started
    photosDiv.innerHTML = "<center><img src = 'images/loader.gif' width = '100px' height = '140px' /></center>";
    const userInput = document.getElementById('searchInput').value;

    const flickr = new Flickr();
    flickr.search(userInput, function(photos) {
        allPhotos = photos;
        showPhotos(photos);
    });
}

/**
 * enterPressed - triggered when enter is pressed after user has written the search term
 */
enterPressed = (event) => {
    var code = (event.keyCode ? event.keyCode : event.which);
    //Enter keycode 13
    if(code == 13) {
        searchForPictures();
    }
}

/**
 * showGallery - triggered when the button View Gallery is clicked
 * @return void
 */
showGallery = () => {
    //we have to clear the photos_div and show the gallery instead
    photosDiv.innerHTML = "";
    viewGalleryDiv.innerHTML = "<a  class = 'btn btn-primary btnGallery' onclick = 'goBackToSearch()' role = 'button'>Go back to search</a>";
    searchDiv.innerHTML = "";
    
    initiateThumbnailView();
}

/**
 * showPhoto - triggered when the user clicks at one of the thumnails in the gallery view
 * it changes the photo viewed in the big container
 * @return void
 */
showPhoto = (img) => {
    photosDiv.innerHTML = `<center><img src = "${img}" class = "bigPicture"></center>`;
}

/**
 * goBackToSearch - triggered when the user clicks Go back to search in gallery view mode
 */
goBackToSearch = () => {
    location.reload();
}

/**
 * showPhotos 
 * @param {Array} photos
 * @return void
 */
showPhotos = (photos) => {
    let html = "";
    if (photos.length > 0 ) {
        for (let photo of photos) {
            prepareTitle(photo.title);
            html += "<div class = 'col-md-4 col-sm-12 card thumb'>";
            html +=     `<div id = 'photo_${photo.id}' class = 'thumbnail'>`;
            html +=         `<img src = '${photo.img}' class = "picture" />`;
            html +=         '<div class="clearfix visible-md-block"></div>';
            html +=         "<div class = 'caption'>";
            html +=             `<h5>${prepareTitle(photo.title)}</h5>`;
            html +=             `<p><a id = "btn_${photo.id}" class = 'btn btn-primary' onclick = 'addToGallery("${photo.id}", "${photo.img}")' role = 'button'>Add To Gallery</a></p>`;
            html +=         "</div>";
            html +=     "</div>";
            html += "</div>";
        }
    }
    else {
        //no results returned
        html += "<center><h2 id = 'message_txt'>NO PHOTOS FOUND WITH THE SPECIFIED NAME</h2></center>";
    }
    
    //inject photos into the html
    photosDiv.innerHTML = html;
}

/**
 * addToGallery - adds the selected photo to the gallery
 * @param {String} id - the id of the photo
 * @param {String} img - the image url
 * @param void
 */
addToGallery = (id, img) => {
    if (!startGalery) {
        startGalery = true;
        //show the checkout button
        const viewGalleryButton = "<button  class = 'btn btn-primary btnGallery' onclick = 'showGallery()' role = 'button'><span id = 'counter_span' class = 'badge'>&nbsp&nbsp&nbsp</span>&nbsp View Gallery</button>";
        viewGalleryDiv.innerHTML += viewGalleryButton;
    }

    const imgObject = { id : id, img : img};
    const photoClass = document.getElementById("photo_" + id).getAttribute("class");

    if (!photoExistsInGallery(imgObject.id)) {
        galleryPhotos.push(imgObject);
        galleryPhotoNr++;   
        //add the css class to the photo
        document.getElementById("photo_" + id).className += " selectedPhoto";
        document.getElementById("btn_" + id).innerHTML = "Remove From Gallery";
    }
    else {
        //the item already exists in the gallery so we should remove it
        removePhotoFromGallery(imgObject.id);
        document.getElementById("photo_" + id).className = "thumbnail";
        document.getElementById("btn_" + id).innerHTML = "Add To Gallery";
        galleryPhotoNr--;
    }
    
    //update the number at the View Gallery button
    document.getElementById('counter_span').innerHTML = galleryPhotoNr.toString();
}

/**
 * photoExistsInGallery - helper function that checks if item exists in the gallery
 * @param {String} photoID
 * @return {Bool}
 */
photoExistsInGallery = (photoID) => {
    for (let photo of galleryPhotos) {
        if (photo.id == photoID) {
            return true;
        }
    }

    return false;
}

/**
 * removePhotoFromGallery
 * @param {String} - photoID
 * @return void
 */
removePhotoFromGallery = (photoID) => {
    for (let i = 0; i < galleryPhotos.length; i++) {
        if (galleryPhotos[i].id == photoID) {
            galleryPhotos.splice(i, 1);
        }
    }
}

/** //col-xs-1 col-md-1//
 * initiateThumbnail - creates the thumbnail photos when we view the gallery
 * @return void
 */
initiateThumbnailView = () => {
    photosDiv.innerHTML = `<center><img src = "${galleryPhotos[0].img}" class = "bigPicture"></center>`;
    thumbnailHTML = "";
    for (let photo of galleryPhotos) {
        thumbnailHTML += `<div class = 'smallImgDiv inline' onclick = 'showPhoto("${photo.img}")'>`;
        thumbnailHTML += "<a href = '#' class = ''>";
        thumbnailHTML += `<img src = "${photo.img}" alt = "Photo" height = "100" width = "100" >`;
        thumbnailHTML += "</a></div>";
    }

    thumbnailDiv.innerHTML = thumbnailHTML;
}

/**
 * prepareTitle - it takes the raw title that was read from flickr
 * if it is longer than 100 characters it cuts it
 * @param rawTitle - the title as read from flickr
 * @return processedTitle|rowTitle
 */
prepareTitle = (rawTitle) => {
    if (rawTitle.length > 100) {
        var processedTitle = "";
        for (let i = 0; i < rawTitle.length; i++) {
            if (i <= 100) {
                processedTitle += rawTitle[i];
            }
        }
        processedTitle += "...";

        return processedTitle;
    }
    else {
        return rawTitle
    }
}