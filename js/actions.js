export {
    ActionAuthorise,
    ActionLoadAccountImages,
    ActionLogOut,
    ActionLoadMoreMedia,
    GetIsReadyForMoreMedia,
    SetIsReadyForMoreMedia
};

import * as imgur from "/js/imgur.js";
import * as constants from "/js/constants.js";
import * as utils from "/js/utils.js";

let mediaObj = {pageOrder:[], mediaLoaded:0, mediaToBeLoaded:0, resultArray:[]};
let isReadyForMoreMedia = true;

function ActionAuthorise() {
    imgur.Authorise();
}

async function ActionLoadAccountImages() {
    ResetMediaObj();
    utils.ClearContent();

    document.getElementById("buttonLoadAccountImages").innerHTML = "Load Account Images Again";

    const imageCount = (await imgur.FetchAccountImageCount()).data;
    const pageCount = Math.ceil(imageCount/constants.PAGE_SIZE);
    let pageOrder = utils.ArrayOfNumbersUpToN(pageCount);
    utils.ShuffleArray(pageOrder);
    for(let i = 0; i < pageOrder.length; i++) {
        imgur.FetchAccountImages(i).then(
            function(response) {HandleAccountImageResponseData(response.data)},
            function(error) {console.log(error)}
        );
    }
}

function ActionLoadMoreMedia() {
    let endIndex = mediaObj.mediaLoaded+constants.IMAGES_TO_LOAD_EACH_TIME;
    mediaObj.mediaToBeLoaded+=constants.IMAGES_TO_LOAD_EACH_TIME;
    for(let i = mediaObj.mediaLoaded; i < endIndex; i++) {
        // exit if we reach the end of the list
        if(i >= mediaObj.resultArray.length)
            return;

        let mediaNew;
        let fileInfo = mediaObj.resultArray[i];
        if(fileInfo.type.includes("image")){
            mediaNew = new Image()
            mediaNew.onload = function() {
                SingleMediaLoaded(this,i);
            }
        } else if(fileInfo.type.includes("video")) {
            mediaNew = document.createElement("video");
            mediaNew.onloadeddata = function() {
                SingleMediaLoaded(this,i);
            }

            mediaNew.setAttribute("autoplay","");
            mediaNew.setAttribute("loop","");
            mediaNew.muted = true;

            if(fileInfo.type.includes("mp4")) {
                mediaNew.classList.add("media-mp4");
            }
        }

        mediaNew.src = fileInfo.link;
        mediaNew.id = i;
        mediaNew.classList.add("media");
        mediaNew.setAttribute("title",i);
    }
}

function ActionLogOut() {
    localStorage.setItem("current_account", null);
    utils.LoggedOut();
}

function HandleAccountImageResponseData(data) {
    let first = false;
    if(mediaObj.resultArray.length == 0)
        first = true;

    mediaObj.resultArray=mediaObj.resultArray.concat(data);
    utils.ShuffleArray(mediaObj.resultArray);

    if(first)
        ActionLoadMoreMedia();
}

function SingleMediaLoaded(media, i) {
    mediaObj.mediaLoaded++;
    //mediaObj.mediaArray.push(media);
    if(constants.MEDIA_QUERY_SM.matches) {
        let contentSingle = document.getElementById("content-single");
        contentSingle.appendChild(media);
    } else {
        utils.AddToShortestColumn(media);
    }

    if(mediaObj.mediaLoaded == mediaObj.mediaToBeLoaded) {
        isReadyForMoreMedia = true;
    }
}

function GetIsReadyForMoreMedia() {
    return isReadyForMoreMedia;
}

function SetIsReadyForMoreMedia(bool) {
    isReadyForMoreMedia = bool;
}

function ResetMediaObj() {
    mediaObj.pageOrder=[];
    mediaObj.mediaLoaded=0;
    mediaObj.mediaToBeLoaded=0;
    mediaObj.resultArray=[];
}