// global vars
var jsonPreviousResponse={input:"", json:""};
var btnBackToTop;

window.onload = function() {
    // fetch the back to top button for later use
    btnBackToTop = document.getElementById("btnBackToTop");

    // check if we have an account set then set the account panel accordingly
    const params = new URLSearchParams(window.location.hash);
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
}

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function(){
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        btnBackToTop.style.display = "block";
    } else {
        btnBackToTop.style.display = "none";
    }
};

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

// populate content columns with images
function PopulateImages(inputArrImages)
{
    // arrays are passed by value so make a copy
    var arrImages = JSON.parse(JSON.stringify(inputArrImages));

    // fetch selected sort
    var elementSort = document.getElementById("sortLoadAlbum");
    var selectedSort = elementSort.options[elementSort.selectedIndex].value;

    // sort images appropriately
    if(selectedSort == "oldest"){}
    else if(selectedSort == "newest")
        arrImages.reverse();
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

    for(var i = 0; i < arrImages.length; i++)
    {
        var newMedia;
        var fileType = arrImages[i].type;

        // if media is image, create new image and set appropriate onload function
        if(fileType.includes("image"))
        {
            newMedia = new Image();
            newMedia.onload = function() {
                AddToShortestColumn(this);
            };
        }
        // if media is video, create new video element, set appropriate onload, add specific attributes
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

        // regardless what type, set the src and add class
        newMedia.src = arrImages[i].link;
        newMedia.classList.add("card-img-top");
    }

    // hide progress bar
    document.getElementById("row-progress").setAttribute("hidden", "");
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
}

// set the account panel to show logged out
function LoggedOut()
{
    document.getElementById("form-account-loggedout").removeAttribute("hidden");
    document.getElementById("form-account-loggedin").setAttribute("hidden", "");
}