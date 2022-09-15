/*
    imgur.js holds function for direct api calls to Imgur
*/

export {
    InitAbortSignal,
    AbortExistingCalls,
    Authorise,
    FetchAccountImageCount,
    FetchPageOfAccountImages,
    FetchAlbumImages
};

import {
    CLIENT_ID,
    ENDPOINT_AUTHORISE,
    ENDPOINT_ACCOUNT_IMAGE_COUNT,
    ENDPOINT_ACCOUNT_IMAGES,
    ENDPOINT_ALBUM_IMAGES
} from  "/js/constants.js";
import {GetCurrentAccount} from "/js/utils.js";
import {HandleError} from "/js/process.js";

let abort = {controller:{},signal:{}};

function InitAbortSignal() {
    abort.controller = new AbortController();
    abort.signal = abort.controller.signal;
}

function AbortExistingCalls() {
    abort.controller.abort();
}

function Authorise() {
    let endpointAuthoriseLocation = ENDPOINT_AUTHORISE.replace("{{clientId}}", CLIENT_ID);
    window.location = endpointAuthoriseLocation;
}

async function FetchAccountImageCount() {
    let headers = new Headers();
    headers.append("Authorization", "Bearer " + GetCurrentAccount().accessToken);
    const requestOptions = {
        method:"GET",
        headers:headers,
        redirect:"follow",
        signal:abort.signal
    };

    const response = await fetch(ENDPOINT_ACCOUNT_IMAGE_COUNT, requestOptions).catch(e => HandleError(e));
    return await response?.json();
}

async function FetchPageOfAccountImages(page = 0) {
    let headers = new Headers();
    headers.append("Authorization", "Bearer "+GetCurrentAccount().accessToken);

    const requestOptions = {
        method:"GET",
        headers:headers,
        redirect:"follow",
        signal:abort.signal
    };

    const endpoint = ENDPOINT_ACCOUNT_IMAGES.replace("{{page}}", page);
    const response = await fetch(endpoint, requestOptions).catch(e => HandleError(e));
    return await response?.json();
}

async function FetchAlbumImages(id) {
    let headers = new Headers();
    headers.append("Authorization", "Bearer " + GetCurrentAccount().accessToken);

    const requestOptions = {
        method:"GET",
        headers:headers,
        redirect:"follow",
        signal:abort.signal
    };

    const endpoint = ENDPOINT_ALBUM_IMAGES.replace("{{albumHash}}", id);
    const response = await fetch(endpoint, requestOptions).catch(e => HandleError(e));
    return await response?.json();
}