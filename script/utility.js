var jsonPreviousResponse={input:"", json:""};
var arrLoadedMedia = [];

window.onload = function() {
    const params = new URLSearchParams(window.location.hash);

    var currentAccount = GetCurrentAccount();
    if(currentAccount != null && Date.now() > currentAccount.expiry)
        LoggedOut();
    else if(currentAccount != null)
        LoggedIn();


    // in this case, we have been redirected from authentication
    if(params.has("account_id"))
    {
        var hash = window.location.hash;
        var searchTerm = "access_token=";
        var locAccessToken = hash.indexOf(searchTerm);
        var locExpiresIn = hash.indexOf("&expires_in");
        var access_token = hash.substring(locAccessToken + searchTerm.length, (locExpiresIn - locAccessToken) + 1);

        var account = {
            username:params.get("account_username"),
            id:params.get("account_id"),
            accessToken:access_token,
            refreshToken:params.get("refresh_token"),
            expiry:Date.now()+params.get("expires_in"),
        }
        
        window.localStorage.setItem("current_account", JSON.stringify(account));
        history.replaceState("", "", window.location.pathname + window.location.search);
        
        LoggedIn();
    }
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

function ClearContent()
{
    for(var i = 0; i < 3; i++)
    {
        var col = document.getElementById("content-col-" + i);
        col.innerHTML = "";
    }
}

function GetCurrentAccount()
{
    return JSON.parse(window.localStorage.getItem("current_account"));
}

/*function PopulateImages(jsonResult)
{
    var arrImages = JSON.parse(jsonResult).data;

    var elementSort = document.getElementById("sortLoadAlbum");
    var selectedSort = elementSort.options[elementSort.selectedIndex].value;

    if(selectedSort == "oldest"){}
    else if(selectedSort == "newest")
        arrImages.reverse();
    else if(selectedSort == "random")
        ShuffleArray(arrImages);

    var contentColumns = [];
    for(var i = 0; i < 3; i++)
    {
        contentColumns.push(document.getElementById("content-col-" + i));
    }
    var flagLoaded;
    for(var i = 0; i < arrImages.length; i++)
    {
        var imgPath = arrImages[i].link;
        var fileType = arrImages[i].type;

        if(fileType.includes("image"))
        {
            imageTags = "<img class='card-img-top' src='" + imgPath + "' id='newMedia' loading='lazy'>";
        }
        else if(fileType.includes("video"))
        {
            imageTags = "<video autoplay muted loop class='card-img-top' loading='lazy' id='newMedia'><source src='" + imgPath + "'></video>";
        }
        
        contentColumns.sort(function(a, b) {
            var heightA = a.getBoundingClientRect().height;
            var heightB = b.getBoundingClientRect().height;
            return heightA - heightB;
        });
        //console.log("0:" + contentColumns[0].getBoundingClientRect().height + " 1:" + contentColumns[1].getBoundingClientRect().height + " 2:" + contentColumns[2].getBoundingClientRect().height);
        //var col = contentColumns[i%3];
        contentColumns[0].innerHTML += imageTags;

        var newMedia = document.getElementById("newMedia");
        newMedia.onload = function(){
            console.log("loaded " + this.src);
        }

        newMedia.removeAttribute('id');
    }

    console.log("loaded all images");
}*/

var toType = function(obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

function AddToShortestColumn(media)
{
    var contentColumns = [];
    for(var i = 0; i < 3; i++)
        contentColumns.push(document.getElementById("content-col-" + i));

    contentColumns.sort(function(a, b) {
        var heightA = a.getBoundingClientRect().height;
        var heightB = b.getBoundingClientRect().height;
        return heightA - heightB;
    });
    
    contentColumns[0].appendChild(media);
}

function PopulateImages(arrImages, numberToLoad = -1)
{
    var elementSort = document.getElementById("sortLoadAlbum");
    var selectedSort = elementSort.options[elementSort.selectedIndex].value;

    if(selectedSort == "oldest"){}
    else if(selectedSort == "newest")
        arrImages.reverse();
    else if(selectedSort == "random")
        ShuffleArray(arrImages);

    if(numberToLoad > -1)
        arrImages = arrImages.slice(0, numberToLoad);

    for(var i = 0; i < arrImages.length; i++)
    {
        var newMedia;
        var fileType = arrImages[i].type;

        if(fileType.includes("image"))
        {
            newMedia = new Image();
            newMedia.onload = function() {
                AddToShortestColumn(this);
            };
        }
        else if(fileType.includes("video"))
        {
            newMedia = document.createElement("video");
            newMedia.onloadeddata = function() {
                AddToShortestColumn(this);
            };

            newMedia.setAttribute("autoplay", "");
            newMedia.setAttribute("loop", "");
            newMedia.muted = true;
        }

        newMedia.src = arrImages[i].link;
        newMedia.classList.add("card-img-top");
    }
}