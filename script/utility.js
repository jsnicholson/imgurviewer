// global vars
const params = GetWindowParams();
var jsonPreviousResponse={input:"", json:""};
var btnBackToTop;
var mediaPopulating = { displayOrder:"", mediaToLoad:0, mediaLoaded:0, mediaArray:[] };
var screenDimensions = { width:0, height:0 };

var mediaSlideshow = { interval:null, inputArray:[], mediaCurrentlyDisplaying:0, playAgain:false};

window.onload = function() {
    // fetch the back to top button for later use
    btnBackToTop = document.getElementById("btnBackToTop");

    // check if we have an account set then set the account panel accordingly
    var currentAccount = GetCurrentAccount();
    if(currentAccount != null && Date.now() > currentAccount.expiry)
        LoggedOut();
    else if(currentAccount != null)
        LoggedIn();

    // in this case, we have been redirected from authentication
    if(params.has("account_id"))
    {
        // fetch the access_token
        // its stored directly after the hash so cant be grabbed easily from params
        var hash = window.location.hash;
        var searchTerm = "access_token=";
        var locAccessToken = hash.indexOf(searchTerm);
        var locExpiresIn = hash.indexOf("&expires_in");
        var access_token = hash.substring(locAccessToken + searchTerm.length, (locExpiresIn - locAccessToken) + 1);

        // create account object with all info
        var account = {
            username:params.get("account_username"),
            id:params.get("account_id"),
            accessToken:access_token,
            refreshToken:params.get("refresh_token"),
            expiry:Date.now()+params.get("expires_in"),
        }
        
        // store the account object to handle 'logged in'
        window.localStorage.setItem("current_account", JSON.stringify(account));
        //remove params from url
        history.replaceState("", "", window.location.pathname + window.location.search);
        
        LoggedIn();
    }

    if(params.has("album"))
        ActionLoadAlbum(params.get("album"));
    else if(params.has("a"))
        ActionLoadAlbum(params.get("a"));

    screenDimensions.width = screen.width;
    screenDimensions.height = screen.height;
}

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function(){
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        btnBackToTop.style.display = "block";
    } else {
        btnBackToTop.style.display = "none";
    }
};

screen.orientation.onchange = function (){
    // swap screen dimensions
    var temp;
    temp = screenDimensions.width;
    screenDimensions.width = screenDimensions.height;
    screenDimensions.height = temp;

    // if modal is showing, adjust the dimensions if we have changed screen orientation
    if(!(document.getElementById("fullscreen-frame").hasAttribute("hidden")))
    {
        var modalImageElement = document.getElementById("fixed-image");
        var modalVideoElement = document.getElementById("fixed-video");
        var width, height, media;
        if(modalImageElement.src != "") { width = modalImageElement.naturalWidth; height = modalImageElement.naturalHeight; media = modalImageElement; }
        else if(modalVideoElement.src != "") { width = modalVideoElement.videoWidth; height = modalVideoElement.videoHeight; media = modalVideoElement; }

        SetModalMediaStyle(media, width, height);
    }
};

function GetWindowParams()
{
    var url = window.location.href;
    var startOfParams = url.indexOf("?");
    var strParams = url.substr(startOfParams);
    return new URLSearchParams(strParams);
}

function ShuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
  
      // swap elements array[i] and array[j]
      // we use "destructuring assignment" syntax to achieve that
      // you'll find more details about that syntax in later chapters
      // same can be written as:
      // let t = array[i]; array[i] = array[j]; array[j] = t
      [array[i], array[j]] = [array[j], array[i]];
    }
}

// remove content from all 3 columns
function ClearContent()
{
    for(var i = 0; i < 3; i++)
    {
        var col = document.getElementById("content-col-" + i);
        col.innerHTML = "";
    }

    document.getElementById("row-content").setAttribute("hidden", "");
}

// fetch the currently 'logged in' account
function GetCurrentAccount()
{
    return JSON.parse(window.localStorage.getItem("current_account"));
}

// convert type to string for debugging
var toType = function(obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

// add media to shortest column
function AddToShortestColumn(media)
{
    // get all 3 columns
    var contentColumns = [];
    for(var i = 0; i < 3; i++)
        contentColumns.push(document.getElementById("content-col-" + i));

    // sort columns by height
    contentColumns.sort(function(a, b) {
        var heightA = a.getBoundingClientRect().height;
        var heightB = b.getBoundingClientRect().height;
        return heightA - heightB;
    });
    
    // place media in shortest
    contentColumns[0].appendChild(media);
}

function CalculateProgress()
{
    // set progress label
    var currentNumImagesLoaded = parseInt(document.getElementById("progress-current").textContent);
    var totalNumImagesToLoad = parseInt(document.getElementById("progress-total").textContent);
    SetProgress(null, currentNumImagesLoaded+1, totalNumImagesToLoad);

    // hide progress bar
    if(currentNumImagesLoaded+1 == totalNumImagesToLoad)
        document.getElementById("row-progress").setAttribute("hidden", "");
}

// populate content columns with images
function PopulateImages(inputArrImages)
{
    ClearContent();
    
    // arrays are passed by value so make a copy
    var arrImages = JSON.parse(JSON.stringify(inputArrImages));

    var slideshow = document.getElementById("checkSlideshow").checked;

    if(!slideshow)
        PopulateGallery(arrImages);
    else
        PopulateSlideshow(arrImages);
}

function GetSortType()
{
    if(params.has("sort")) {
        var type = params.get("sort");
        SetSortTypeDOM(type);
        return type;
    }
    else if(params.has("s")) {
        var type = params.get("s");
        SetSortTypeDOM(type);
        return type;
    }
    else
    {
        var elementSort = document.getElementById("sortLoadAlbum");
        return elementSort.options[elementSort.selectedIndex].value;
    }
}

function SetSortTypeDOM(sortType)
{
    var sortDropdown = document.getElementById("sortLoadAlbum");
    switch(sortType)
    {
        case "newest":
            sortDropdown.selectedIndex = 0;
            break;
        case "oldest":
            sortDropdown.selectedIndex = 1;
            break;
        case "random":
            sortDropdown.selectedIndex = 2;
            break;
        default:
            sortDropdown.selectedIndex = 0;
            break;
    }
}

function PopulateGallery(arrImages)
{
    // fetch selected sort
    var selectedSort = GetSortType();

    // sort images appropriately
    if(selectedSort == "newest")
        arrImages.reverse();
    else if(selectedSort == "oldest"){}
    else if(selectedSort == "random")
        ShuffleArray(arrImages);

    // fetch selected display amount
    var elementAmount = document.getElementById("selectDisplayCount");
    var selectedAmount = elementAmount.options[elementAmount.selectedIndex].value;
    var numberToLoad;

    // set value appropriately
    if(selectedAmount == "20")
        numberToLoad = 20;
    else if(selectedAmount == "50")
        numberToLoad = 50;
    else if(selectedAmount == "all")
        numberToLoad = -1;

    // take the first 'numberToLoad' images
    if(numberToLoad > -1)
        arrImages = arrImages.slice(0, numberToLoad);

    // unhide progress and set label
    document.getElementById("row-progress").removeAttribute("hidden");
    SetProgress("Images: ", 0, arrImages.length);

    document.getElementById("row-content").removeAttribute("hidden");

    // store information about what we're loading so the media can handle it when it loads
    mediaPopulating.displayOrder = selectedSort;
    mediaPopulating.mediaToLoad = arrImages.length;
    mediaPopulating.mediaLoaded = 0;
    mediaPopulating.mediaArray = [];

    for(var i = 0; i < arrImages.length; i++)
    {
        var newMedia;
        var fileType = arrImages[i].type;

        // if media is image, create new image and set appropriate onload function
        if(fileType.includes("image"))
        {
            newMedia = new Image();
            newMedia.onload = function() {
                SingleMediaLoaded(this);
            };

            newMedia.onclick = function() {
                ShowModalImage(this.src);
            }
        }
        // if media is video, create new video element, set appropriate onload, add specific attributes
        else if(fileType.includes("video"))
        {
            newMedia = document.createElement("video");
            newMedia.onloadeddata = function() {
                SingleMediaLoaded(this);
            };

            newMedia.onclick = function() {
                ShowModalVideo(this.src);
            }

            newMedia.setAttribute("autoplay", "");
            newMedia.setAttribute("loop", "");
            newMedia.muted = true;
        }

        // regardless what type, set the src and add class
        newMedia.src = arrImages[i].link;
        newMedia.id = i;
        newMedia.classList.add("card-img-top");
    }
}

function PopulateSlideshow(inputArrImages)
{
    // fetch selected sort
    var elementSort = document.getElementById("sortLoadAlbum");
    var displayOrder = elementSort.options[elementSort.selectedIndex].value;

    // sort images appropriately
    if(displayOrder == "newest")
        inputArrImages.reverse();
    else if(displayOrder == "oldest"){}
    else if(displayOrder == "random")
        ShuffleArray(inputArrImages);

    mediaSlideshow.inputArray = inputArrImages;
    StartSlideshow();

}

function StartSlideshow() {
    SetSlideshow();
    mediaSlideshow.interval = setInterval(SetSlideshow, 5000);
}

function StopSlideshow() {
    clearInterval(mediaSlideshow.interval);
}

function SetSlideshow()
{   
    ShowModalMedia(mediaSlideshow.inputArray[mediaSlideshow.mediaCurrentlyDisplaying], function() {
        var video = document.getElementById("fixed-video");
        if(video.duration != null && video.duration*1000 > 5000) {
            video.removeAttribute("loop");
            clearInterval(mediaSlideshow.interval);
            if(video.duration*1000 < 8000)
                mediaSlideshow.playAgain = true;

            video.onended = function() {
                if(mediaSlideshow.playAgain == true)
                {
                    var video = document.getElementById("fixed-video");
                    video.pause();
                    video.currentTime = 0;
                    video.play();
                    mediaSlideshow.playAgain = false;
                }
                else if(mediaSlideshow.interval != null) {
                    StartSlideshow();
                }
            };
        }
        else
            video.setAttribute("loop",""); 
    });
    mediaSlideshow.mediaCurrentlyDisplaying = (mediaSlideshow.mediaCurrentlyDisplaying + 1) % mediaSlideshow.inputArray.length;
}

function ResetSlideshow()
{
    document.getElementById("fixed-video").setAttribute("loop", "");
    document.getElementById("fixed-video").onended = null;
    mediaSlideshow.mediaCurrentlyDisplaying = 0;
    mediaSlideshow.inputArray = null;
    if(mediaSlideshow.interval != null)
        clearInterval(mediaSlideshow.interval);
    mediaSlideshow.interval = null;
    mediaSlideshow.playAgain = false;
}

// called when a single piece of media has loaded
function SingleMediaLoaded(media)
{
    mediaPopulating.mediaLoaded++;
    mediaPopulating.mediaArray.push(media);

    // if order is random then just add to shortest column
    if(mediaPopulating.displayOrder == "random")
    {
        AddToShortestColumn(media);
    }
    // otherwise we want to try and preserve the order, despite them loading at different times
    else if(mediaPopulating.displayOrder == "newest" || mediaPopulating.displayOrder == "oldest")
    {
        // all media loaded
        if(mediaPopulating.mediaLoaded >= mediaPopulating.mediaToLoad)
            AllMediaLoaded();
    }

    CalculateProgress();
}

function AllMediaLoaded()
{
    // get all 3 columns
    var contentColumns = [];
    var content = [];
    for(var i = 0; i < 3; i++)
        contentColumns.push(document.getElementById("content-col-" + i));
    
    var mediaArray = mediaPopulating.mediaArray;
    // id was stored as position in original list so sort by that
    mediaArray.sort(function(a, b) {
        return a.id - b.id;
    });

    var columnAmount = Math.floor(mediaArray.length/3);
    // pull a third for the first 2 columns and the remainder for the last
    var mediaCol1 = mediaArray.slice(0, columnAmount);
    var mediaCol2 = mediaArray.slice(columnAmount, 2*columnAmount);
    var mediaCol3 = mediaArray.slice(2*columnAmount, mediaArray.length);
    content[0] = mediaCol1;
    content[1] = mediaCol2;
    content[2] = mediaCol3;

    // add each content array to the correct content column
    for(var i = 0; i < contentColumns.length; i++)
    {
        for(var j = 0; j < content[i].length; j++)
        {
            contentColumns[i].appendChild(content[i][j]);
        }
    }
}

// When the user clicks on the button, scroll to the top of the document
function ScrollToTop() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

// set the account panel to show logged in
function LoggedIn()
{
    document.getElementById("form-account-loggedin").removeAttribute("hidden");
    document.getElementById("form-account-loggedout").setAttribute("hidden", "");
    document.getElementById("label-current-account").textContent = GetCurrentAccount().username;

    // also show upload options once logged in
    document.getElementById("row-upload").removeAttribute("hidden");
}

// set the account panel to show logged out
function LoggedOut()
{
    document.getElementById("form-account-loggedout").removeAttribute("hidden");
    document.getElementById("form-account-loggedin").setAttribute("hidden", "");

    // also hide upload options once logged out
    document.getElementById("row-upload").setAttribute("hidden", "");
}

// set label above progress bar
function SetProgress(type, current, total)
{
    if(type != null)
        document.getElementById("progress-type").textContent = type;
    
    if(current != null)
        document.getElementById("progress-current").textContent = current;
    
    if(total != null)
        document.getElementById("progress-total").textContent = total;

    document.getElementById("row-progress").removeAttribute("hidden");

    // set bar
    var percent = (current/total)*100;
    var progessBar = document.getElementById("loading-progress");
    progessBar.style = "width:" + percent + "%;";
    progessBar.setAttribute("aria-valuenow", percent);
}

function HideModal()
{
    document.getElementById("fixed-image").setAttribute("src", "");
    document.getElementById("fixed-video").setAttribute("src", "");

    document.getElementById("fullscreen-frame").setAttribute("hidden", "");

    enableScroll();

    ResetSlideshow();
}

function ShowModalMedia(media, onload=null)
{
    if(media.type.includes("image"))
        ShowModalImage(media.link, onload);
    else if(media.type.includes("video"))
        ShowModalVideo(media.link, onload);
}

function ShowModalImage(src, onload=null)
{
    disableScroll();

    var imageElement = document.getElementById("fixed-image");
    var videoElement = document.getElementById("fixed-video");

    imageElement.removeAttribute("hidden");
    videoElement.setAttribute("hidden", "");

    imageElement.setAttribute("src", src);
    videoElement.setAttribute("src", "");

    document.getElementById("fullscreen-frame").removeAttribute("hidden");

    imageElement.onload = function() {
        if(onload != null)
            onload();
        SetModalMediaStyle(this, this.naturalWidth, this.naturalHeight);
    }
}

function ShowModalVideo(src, onload=null)
{
    disableScroll();

    var imageElement = document.getElementById("fixed-image");
    var videoElement = document.getElementById("fixed-video");

    imageElement.setAttribute("hidden", "");
    videoElement.removeAttribute("hidden");

    imageElement.setAttribute("src", "");
    videoElement.setAttribute("src", src);

    document.getElementById("fullscreen-frame").removeAttribute("hidden");

    videoElement.onloadeddata = function() {
        if(onload != null)
            onload();
        SetModalMediaStyle(this, this.videoWidth, this.videoHeight);
    };
}

// we cant have width and height changing to max purely controlled by css
// here we figure out if its portrait or landscape and adjust accordingly
// wouldnt have to do this if some images werent significantly smaller than the screen size
function SetModalMediaStyle(media, srcWidth, srcHeight)
{
    var screenWidth = screenDimensions.width;
    var screenHeight = screenDimensions.height;

    var screenRatio = screenWidth/screenHeight;
    var srcRatio = srcWidth/srcHeight;

    if(screenRatio < srcRatio)
    {
        media.style.width = "95%";
        media.style.height = "auto";
    }
    else
    {   
        media.style.width = "auto";
        media.style.height = "95%";
    }
}

// call this to Disable
function disableScroll() { 
    // Get the current page scroll position 
    scrollTop = window.pageYOffset || document.documentElement.scrollTop; 
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft, 
  
        // if any scroll is attempted, set this to the previous value 
        window.onscroll = function() { 
            window.scrollTo(scrollLeft, scrollTop); 
        }; 
} 
  
// call this to Enable
function enableScroll() { 
    window.onscroll = function() {}; 
}

// display a success alert for 5 seconds
function AlertSuccess(msg="Your action was successful") {
    var alert = document.getElementById("alert-success");
    var $alert = $('.alert');

    document.getElementById("alert-msg-success").innerHTML = msg;

    alert.removeAttribute("hidden");
    ScrollToTop();
    setTimeout(function(){
        alert.setAttribute("hidden", "");
    }, 8000);
}

// display an error alert for 5 seconds
function AlertError(msg="There was an error") {
    var alert = document.getElementById("alert-error");
    var $alert = $('.alert');

    document.getElementById("alert-msg-error").innerHTML = msg;

    alert.removeAttribute("hidden");
    ScrollToTop();
    setTimeout(function(){
        alert.setAttribute("hidden", "");
    }, 8000);
}

// there are some websites that we can get direct image links for even if they arent provided
// fetch them here
function GetDirectImageURL(_imageURL)
{
    var imageURL = _imageURL;
    // supported imgur formats
    var formats = [".jpeg", ".jpg", ".png", ".gif", ".gifv", ".apng", ".tiff", ".mpeg", ".avi", ".webm", ".quicktime", ".x-matroska", ".x-flv", ".x-msvideo", ".x-ms-wmv"];
    var formatExtension = imageURL.substr(imageURL.lastIndexOf("."));
    var usableFormat = formats.includes(formatExtension);
    
    if(!usableFormat)
    {
        // not a direct link and we dont have any special measures in place to extract it
        AlertError("Error: not a direct file link and no special measure to fetch it")
        return false;
    }
    
    return imageURL;
}

function OnSlideshowChanged()
{
    var checkbox = document.getElementById("checkSlideshow");
    var selectNumber = document.getElementById("selectDisplayCount");

    selectNumber.disabled = !checkbox.checked;
}