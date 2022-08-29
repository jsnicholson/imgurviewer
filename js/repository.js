export {
    GetAccountImageCount,
    GetAllAccountImagesWithSortOrder,
    AbortExistingCallsIfExist
};

import * as imgur from "/imgurviewer/js/imgur.js";
import * as events from "/imgurviewer/js/events.js";
import * as utils from "/imgurviewer/js/utils.js";
import * as constants from "/imgurviewer/js/constants.js";

let results = {data:[],pageCount:0,pagesLoaded:0};

async function GetAccountImageCount() {
    return (await imgur.FetchAccountImageCount()).data;
}

async function GetAllAccountImagesWithSortOrder() {
    results = {data:[],pagesLoaded:0};
    imgur.InitAbortSignal();

    const imageCount = await GetAccountImageCount();
    results.pageCount = Math.ceil(imageCount/constants.PAGE_SIZE);
    let pageOrder = utils.ArrayOfNumbersUpToN(results.pageCount - 1);

    const sortOrder = utils.GetDisplayOptions().sortOrder;
    switch (sortOrder) {
        case "newest":
            GetAllAccountImagesByNewest(pageOrder);
            break;
        case "oldest":
            GetAllAccountImagesByOldest(pageOrder);
            break;
        case "random":
            GetAllAccountImagesAtRandom(pageOrder);
            break;
        default:
            break;
    }
}

async function GetAllAccountImagesByNewest(arrPageOrder) {
    GetPagesOfAccountImages(arrPageOrder);
}

async function GetAllAccountImagesByOldest(arrPageOrder) {
    let newOrder = arrPageOrder.reverse();
    GetPagesOfAccountImages(newOrder);
    
}

async function GetAllAccountImagesAtRandom(arrPageOrder) {
    utils.ShuffleArray(arrPageOrder);
    GetPagesOfAccountImages(arrPageOrder);
}

async function GetPagesOfAccountImages(arrPageOrder) {
    for(let i = 0; i < arrPageOrder.length; i++) {
        const pageNum = arrPageOrder[i];
        const response = await GetPageOfAccountImages(pageNum);
        if(!response || response == null || response == undefined) {
            return;
        }
        if(utils.GetDisplayOptions().sortOrder == "oldest")
            response.data.reverse();
        results.data=results.data.concat(response.data);
        results.pagesLoaded++;
        events.DispatchEventPageOfResultsLoaded(response.data, pageNum);
    }
}

async function GetPageOfAccountImages(pageNum) {
    return await imgur.FetchPageOfAccountImages(pageNum);
}

function AbortExistingCallsIfExist() {
    if(results.pagesLoaded < results.pageCount)
        imgur.AbortExistingCalls();
}