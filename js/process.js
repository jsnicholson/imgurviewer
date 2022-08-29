export {
    HandleEventPageOfResultsLoaded,
    LoadMoreMedia,
    SingleMediaLoaded,
    HandleError,
    InitMediaObj,
    GetDisplayOptions,
    GetIsReadyForMoreMedia,
    SetIsReadyForMoreMedia
};

import * as utils from "/js/utils.js";
import * as actions from "/js/actions.js";
import * as constants from "/js/constants.js";
import * as build from "/js/build.js";

let mediaObj = {mediaLoaded:0, mediaToBeLoaded:0, mediaArray:[], pagesLoaded:0, isReadyForMoreMedia:true, mediaElements:[]};
let displayOptions = {sortOrder:"", automaticallyLoadMoreMedia:false};

function HandleEventPageOfResultsLoaded(event) {
    let first = false;
    if(mediaObj.pagesLoaded == 0)
        first = true;

    mediaObj.pagesLoaded++;
    mediaObj.mediaArray=mediaObj.mediaArray.concat(event.detail.pageOfResultsLoaded);

    if(utils.GetDisplayOptions().sortOrder == "random")
        ShuffleUnloadedMedia();

    if(first)
        actions.ActionLoadMoreMedia();
}

function LoadMoreMedia() {
    document.getElementById("spinnerLoadingContainer").removeAttribute("hidden");

    let endIndex = mediaObj.mediaLoaded+constants.IMAGES_TO_LOAD_EACH_TIME;
    mediaObj.mediaToBeLoaded+=constants.IMAGES_TO_LOAD_EACH_TIME;
    for(let i = mediaObj.mediaLoaded; i < endIndex; i++) {
        // exit if we reach the end of the list
        if(i >= mediaObj.mediaArray.length)
            return;

        let fileInfo = mediaObj.mediaArray[i];
        let media = build.BuildMediaWithSkeleton(fileInfo);
        mediaObj.mediaElements.push(media);

        utils.AddMediaToGallery(media);
    }
}

function SingleMediaLoaded(media) {
    mediaObj.mediaLoaded++;

    media.parentNode.classList.remove("media-loading");

    if(mediaObj.mediaLoaded == mediaObj.mediaToBeLoaded) {
        mediaObj.isReadyForMoreMedia = true;
        document.getElementById("spinnerLoadingContainer").setAttribute("hidden","");

        if(!utils.GetDisplayOptions().automaticallyLoadMoreMedia)
            document.getElementById("buttonLoadMoreMedia").removeAttribute("hidden");
    }
}

function HandleError(error) {
    console.log(`there was an error: ${error}`);
    console.log(typeof(error));
    console.log(error);
    console.log(JSON.stringify(error));
    utils.ShowAlert("danger", constants.ERROR_FETCH_ABORTED);
}

function InitMediaObj() {
    mediaObj = {mediaLoaded:0, mediaToBeLoaded:0, mediaArray:[], pagesLoaded:0, mediaElements:[]};
}

function GetDisplayOptions() {
    displayOptions.sortOrder = utils.GetSortOrder();
    displayOptions.automaticallyLoadMoreMedia = utils.GetCheckAutomaticallyLoadMoreMedia();
    return displayOptions;
}

function ShuffleUnloadedMedia() {
    const mediaAlreadyLoaded = mediaObj.mediaArray.slice(0,mediaObj.mediaLoaded);
    const mediaNotYetLoaded = mediaObj.mediaArray.slice(mediaObj.mediaLoaded, mediaObj.mediaArray.length);
    utils.ShuffleArray(mediaNotYetLoaded);
    mediaObj.mediaArray = mediaAlreadyLoaded.concat(mediaNotYetLoaded);
}

function GetIsReadyForMoreMedia() {
    return mediaObj.isReadyForMoreMedia;
}

function SetIsReadyForMoreMedia(bool) {
    mediaObj.isReadyForMoreMedia = bool;
}