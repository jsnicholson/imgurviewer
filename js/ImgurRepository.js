/*
    imgur repository makes direct calls to imgur api
    has state in abort controller but this is handled internally
*/
export {
    Authorise,
    FetchAccountImageCount,
    FetchPageOfAccountImages
}

import {
    CLIENT_ID,
    ENDPOINT_AUTHORISE,
    ENDPOINT_ACCOUNT_IMAGE_COUNT,
    ENDPOINT_ACCOUNT_IMAGES,
} from  "/js/constants.js";
import { HandleError } from "/js/Error.js";

    // #InitAbortSignal() {
    //     this.#abort.controller = new AbortController();
    //     this.#abort.signal = this.#abort.controller.signal;
    // }

    // AbortExistingCalls() {
    //     this.#abort.controller.abort();
    //     this.#InitAbortSignal();
    // }

function Authorise() {
    let endpointAuthoriseLocation = ENDPOINT_AUTHORISE.replace("{{clientId}}", CLIENT_ID);
    window.location = endpointAuthoriseLocation;
}

/*
    expected data
    {
        signalAbort
        tokenAccess
    }
*/
async function FetchAccountImageCount(data) {
    let headers = new Headers();
    headers.append("Authorization", "Bearer " + data.tokenAccess);
    const requestOptions = {
        method:"GET",
        headers:headers,
        redirect:"follow",
        signal:data.signalAbort
    };

    const response = await fetch(ENDPOINT_ACCOUNT_IMAGE_COUNT, requestOptions).catch(e => HandleError(e));
    return await response?.json();
}

/*
    expected data
    {
        signalAbort
        tokenAccess
        intPage
    }
*/
async function FetchPageOfAccountImages(data) {
    let headers = new Headers();
    headers.append("Authorization", "Bearer "+ data.tokenAccess);

    const requestOptions = {
        method:"GET",
        headers:headers,
        redirect:"follow",
        signal:data.signalAbort
    };

    const endpoint = ENDPOINT_ACCOUNT_IMAGES.replace("{{page}}", data.intPage);
    const response = await fetch(endpoint, requestOptions).catch(e => HandleError(e));
    return await response?.json();
}