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
    SetupForMedia,
    OpenFullscreenMedia,
    EnableScroll,
    DisableScroll,
    IsChildOf,
    RemoveFileExtension,
    GetJsonTags,
    JsonDataToBlob,
    DownloadBlob,
    LoadJsonFileToTags,
    LoadTagFileIfSelected
};

import * as constants from "/imgurviewer/js/constants.js"
import * as compose from "/imgurviewer/js/compose.js";
import * as repository from "/imgurviewer/js/repository.js";
import * as process from "/imgurviewer/js/process.js";
import * as tags from "/imgurviewer/js/tagfile.js";
import BsTags from "/imgurviewer/vendor/bstags/js/tags.js";

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
    const checkOnlyAddMediaOnceLoaded = document.getElementById("checkOnlyAddMediaOnceLoaded");
    return {
        sortOrder:sortSelect.value,
        automaticallyLoadMoreMedia:checkAutomaticallyLoadMoreMedia.checked,
        onlyAddMediaOnceLoaded:checkOnlyAddMediaOnceLoaded.checked
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

function OpenFullscreenMedia(media) {
    DisableScroll();
    const section = document.querySelector("#sectionContentFullscreen");
    const container = document.querySelector("#fullscreenMediaContainer");
    while(container.firstChild)
        container.removeChild(container.lastChild);
    const newMedia = media.cloneNode();
    container.appendChild(newMedia);
    section.removeAttribute("hidden");
    const sourceTextBox = document.querySelector("#inputSource");
    sourceTextBox.value = RemoveFileExtension(newMedia.src);
    const buttonGoToSource = document.querySelector("#buttonGoToSource");
    buttonGoToSource.setAttribute("href", sourceTextBox.value);
    const selectTags = document.querySelector("#selectTagsMedia");
    const id = ImgurUrlToId(newMedia.src);
    selectTags.setAttribute("data-tags-for", id);
    const tagInstance = BsTags.getInstance(document.querySelector("#selectTagsMedia"));
    tagInstance.reset();
    const dataTags = tags.GetAllTagData()[id];
    if(dataTags) {
        for(const tag of dataTags.tags) {
            tagInstance.addItem(tag);
        }
    }
    tagInstance._adjustWidth();
}

function ResetFullscreenMedia() {
    const container = document.querySelector("#fullscreenMediaContainer");
    while(container.firstChild)
        container.removeChild(container.lastChild);
}

function SetFullscreenMedia(media) {
    const container = document.querySelector("#fullscreenMediaContainer");
    const newMedia = media.cloneNode();
    container.append(newMedia);
}

function SetFullscreenMediaDetailsSource(media) {
    const sourceTextBox = document.querySelector("#inputSource");
    sourceTextBox.value = RemoveFileExtension(media.src);
    const buttonGoToSource = document.querySelector("#buttonGoToSource");
    buttonGoToSource.setAttribute("href", sourceTextBox.value);
}

function SetFullscreenMediaDetailsTags(media) {
    const selectTags = document.getElementById("selectTagsMedia");
    const tagInstance = BsTags.getInstance(document.getElementById("selectTagsMedia"));
    const id = ImgurUrlToId(media.src);
    selectTags.setAttribute("data-tags-for", id);
    
    tagInstance.reset();
    const dataTags = tags.GetAllTagData()[id];
    if(dataTags) {
        for(const tag of dataTags.tags) {
            tagInstance.addItem(tag);
        }
    }
    tagInstance._adjustWidth();
}

function EnableScroll() {
    document.body.classList.remove("prevent-scrolling");
}

function DisableScroll() {
    const body = document.body;
    if(body)
        document.body.classList.add("prevent-scrolling");
}

function IsChildOf(childNode, parentId) {
    while(childNode.parentNode) {
        if(childNode.parentNode.id == parentId)
            return true;
        childNode = childNode.parentNode;
    }
    return false;
}

function RemoveFileExtension(path) {
    return path.substring(0, path.lastIndexOf('.'));
}

function ImgurUrlToId(url) {
    return url.substring(url.lastIndexOf("/")+1 ,url.lastIndexOf("."));
}

function GetJsonTags() {
    return tags.GetAllTagData();
}

function JsonDataToBlob(data) {
    return new Blob([JSON.stringify(data)], { type: "text/json" });
}

function DownloadBlob(blob, filename) {
    const link = document.createElement("a");
    link.download = filename;
    link.href = window.URL.createObjectURL(blob);
    link.dataset.downloadurl = ["text/json", link.download, link.href].join(":");
    const evt = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
    });

    link.dispatchEvent(evt);
    link.remove()
}

function LoadJsonFileToTags(file) {
    var reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = function (event) {
        tags.SetJsonTags(JSON.parse(event.target.result))
        console.log(`file ${file.name} successfully loaded`);
    }
}

function LoadTagFileIfSelected() {
    if(document.querySelector("#inputTagFile").files.length > 0) {
        const file = document.querySelector("#inputTagFile").files[0];
        LoadJsonFileToTags(file);
    }
}