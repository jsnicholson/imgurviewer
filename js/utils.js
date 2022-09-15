export {
    HandleParams,
    GetCurrentAccount,
    ShuffleArray,
    AddMediaToGallery,
    ArrayOfNumbersUpToN,
    LoggedIn,
    LoggedOut,
    ScrollToTop,
    ClearContent,
    GetDisplayOptions,
    IsValidGifUrl,
    SetupContentColumns,
    ChangeText,
    ShowAlert,
    InputToAlbumId,
    SetupForMedia
};

import * as constants from "/js/constants.js"
import * as compose from "/js/compose.js";
import * as repository from "/js/repository.js";
import * as process from "/js/process.js";

function HandleParams() {
    const params = GetWindowParams();
    // user has just authorised and been returned from imgur
    if(params.has("account_id")) {
        StoreNewlyAuthorisedUser(params);
        LoggedIn();
    }
}

function GetWindowParams() {
    let completeUrl = new URL(window.location.href.replace("#","?"));
    return new URLSearchParams(completeUrl.search);
}

function StoreNewlyAuthorisedUser(params) {
    const accountObj = {
        username:params.get("account_username"),
        id:params.get("account_id"),
        accessToken:params.get("access_token"),
        refreshToken:params.get("refresh_token"),
        expiry:Date.now()+params.get("expires_in")
    }

    window.localStorage.setItem("current_account", JSON.stringify(accountObj));
    history.replaceState("","", window.location.pathname + window.location.search);
}

function GetCurrentAccount() {
    return JSON.parse(window.localStorage.getItem("current_account"));
}

function ShuffleArray(array, lowerLimit = 0) {
    for (let i = array.length - 1; i > lowerLimit; i--) {
      let j = Math.floor(Math.random() * (i + 1)) + lowerLimit; // random index from 0 to i
      [array[i], array[j]] = [array[j], array[i]];
    }
}

function AddMediaToGallery(media) {
    AddToShortestColumn(media);
}

function AddToShortestColumn(media) {
    // get all content columns
    let contentColumns = Array.from(document.querySelectorAll(".content-col"));
    let contentWrappers = [];
    for(const contentColumn of contentColumns)
        contentWrappers.push(contentColumn.querySelector(".content"));

    // sort columns by height
    contentWrappers.sort(function(a, b) {
        var heightA = a.getBoundingClientRect().height;
        var heightB = b.getBoundingClientRect().height;
        return heightA - heightB;
    });
    
    // place media in shortest
    contentWrappers[0].appendChild(media);
}

function ArrayOfNumbersUpToN(n) {
    let arr = [];
    for(let i = 0; i <= n; i++) {
        arr.push(i)
    }
    return arr;
}

function LoggedIn() {
    let buttonAuthorise = document.getElementById("buttonAuthorise");
    let buttonLogOut = document.getElementById("buttonLogOut");
    buttonAuthorise.classList.add("d-none");
    buttonLogOut.classList.remove("d-none");

    const textAccount = document.getElementById("paragraphAccount");
    const text = constants.TEXT_SIGNED_IN_AS.replace("{username}", GetCurrentAccount().username);
    textAccount.innerHTML = text;
}

function LoggedOut() {
    let buttonAuthorise = document.getElementById("buttonAuthorise");
    let buttonLogOut = document.getElementById("buttonLogOut");
    buttonAuthorise.classList.remove("d-none");
    buttonLogOut.classList.add("d-none");

    const textAccount = document.getElementById("paragraphAccount");
    textAccount.innerHTML = constants.TEXT_NOT_SIGNED_IN;
}

function ClearContent() {
    document.querySelector("#content-gallery").innerHTML="";
    document.getElementById("buttonLoadMoreMedia").setAttribute("hidden","");
    document.getElementById("spinnerLoadingContainer").setAttribute("hidden","");
}

function ScrollToTop() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

function GetDisplayOptions() {
    const sortSelect = document.getElementById("selectSortOrder");
    const checkAutomaticallyLoadMoreMedia = document.getElementById("checkAutoLoadMoreMedia");
    return {
        sortOrder:sortSelect.value,
        automaticallyLoadMoreMedia:checkAutomaticallyLoadMoreMedia.checked
    };
}

function IsValidGifUrl(url) {
    if(!url.includes(".gif")) {
        console.log(`${url} is not a link to a gif`);
        return false;
    }

    let indexOfExtension = url.lastIndexOf(".gif");
    let indexOfId = url.lastIndexOf(".com/");

    let idLength = url.slice(indexOfId+5,indexOfExtension).length;
    return (idLength == 7) ? true : false;
}

function ChangeText(map) {
    for(const [selector, text] of map) {
        const elems = document.querySelectorAll(selector);
        for(const elem of elems)
            elem.textContent = text;
    }
}

function SetupContentColumns() {
    const containerWidth = document.querySelector("#content-gallery").offsetWidth;

    let numCols;
    if(containerWidth <= constants.BREAKPOINT_SM)
        numCols = 1;
    else if(containerWidth <= constants.BREAKPOINT_MD)
        numCols = 2;
    else
        numCols = 3;

    compose.ComposeContentColumns(numCols);
}

function ShowAlert(type, message) {
    let alert = document.getElementById("alert");
    let alertMessage = document.getElementById("alert-msg");
    alertMessage.textContent = message;
    alert.setAttribute("class",`alert alert-dismissible ${constants.ERRORMAP_TYPE_TO_CLASS.get(type)}`);
    alert.removeAttribute("hidden");
}

function InputToAlbumId() {
    let value = document.querySelector("#inputAlbumId").value;
    if(value.includes("/")) {
        let lastSlash = value.lastIndexOf("/");
        return value.slice(lastSlash);
    } else
        return value;
}

function SetupForMedia() {
    repository.AbortExistingCallsIfExist();
    process.InitMediaObj();
    ClearContent();
    SetupContentColumns();
}