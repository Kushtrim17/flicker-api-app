"use strict";

class Flickr
{
    //the constructor of the class
    constructor() {
        /**
         * the base url of the api endpoint
         */
        this.BASE_URL = "https://api.flickr.com/services/rest/?method=flickr.photos.search";

        /**
         * the api key
         */
        this.API_KEY = "&api_key=64e4680fac15a40cb423aebbc9760de9";

        /**
         * the text the user has provided
         */
        this.INPUT = "&text=";

        /**
         * other params e.g. //"&per_page=15&page=1"//
         * .. for now we keep it empty
         */
        this.PARAMS = "";;

        /**
         * the response format
         */
        this.FORMAT = "&format=json&nojsoncallback=1";

        /**
         * get http request
         */
        this.GET = "GET";
    }

    /**
     * search - makes an API call to Flickr service with the required word
     * @param {String} text - is the text user has provided us with
     * @param {Callback} callback
     * @return {Array} pictures - the pictures array
     */
    search(text, callback) {
        //construct the api endpoint url
        const requestURL = this.BASE_URL + this.API_KEY + this.INPUT + text + this.PARAMS + this.FORMAT;
        try {
            //make the request
            this.httpRequest(requestURL, function(data) {
                if (data instanceof Object && data.stat === "ok") {
                    for (let picture of data.photos.photo) {
                        //in order to construct an image we have to combine the different
                        //parameters that we get from the API response in the following way
                        let img = `https://farm${picture.farm}.staticflickr.com/` +
                            `${picture.server}/${picture.id}_${picture.secret}.jpg`;

                        //then we add the image i.e. image url to the picture object
                        picture.img = img;
                    }

                    return callback(data.photos.photo);
                }
                else {
                    console.log(data);
                }
            });
        }
        catch (error) {
            console.log(error);
        }
	}

    /**
     * httpRequest - makes a http request to the specified url
     * @param {String} url - is the url of the API endpoint
     * @param {Callback} callback
     * @return {Array} data
     */
    httpRequest(url, callback) {
        const Httpreq = new XMLHttpRequest();
        Httpreq.open(this.GET, url, false);
        Httpreq.send(null);

        return callback(JSON.parse(Httpreq.responseText));
    }
}
