export {
    HandleParams,
    GetCurrentAccount,
    ShuffleArray,
    AddToShortestColumn,
    ArrayOfNumbersUpToN,
    LoggedIn,
    LoggedOut,
    ScrollToTop,
    ClearContent,
    GetSortOrder
};

import * as constants from "/js/constants.js"

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

function AddToShortestColumn(media) {
    // get all 3 columns
    var contentColumns = []; 
    contentColumns.push(document.getElementById("content-col-1"));
    contentColumns.push(document.getElementById("content-col-2"));
    contentColumns.push(document.getElementById("content-col-3"));

    // sort columns by height
    contentColumns.sort(function(a, b) {
        var heightA = a.getBoundingClientRect().height;
        var heightB = b.getBoundingClientRect().height;
        return heightA - heightB;
    });
    
    // place media in shortest
    contentColumns[0].appendChild(media);
}

function ArrayOfNumbersUpToN(n) {
    let arr = [];
    for(let i = 1; i <= n; i++) {
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
    let contentSingle = document.getElementById("content-single");
    let contentGalleryColumns = [];
    contentGalleryColumns.push(document.getElementById("content-col-1"));
    contentGalleryColumns.push(document.getElementById("content-col-2"));
    contentGalleryColumns.push(document.getElementById("content-col-3"));

    contentSingle.innerHTML="";
    contentGalleryColumns[0].innerHTML="";
    contentGalleryColumns[1].innerHTML="";
    contentGalleryColumns[2].innerHTML="";
}

function ScrollToTop() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

function GetSortOrder() {
    const sortSelect = document.getElementById("selectSortOrder");
    console.log(sortSelect.value);
    return sortSelect.value;
}