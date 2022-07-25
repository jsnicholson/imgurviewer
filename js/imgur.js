export {
    Authorise,
    FetchAccountImageCount,
    FetchAccountImages
};

import {
    CLIENT_ID,
    ENDPOINT_AUTHORISE,
    ENDPOINT_ACCOUNT_IMAGE_COUNT,
    ENDPOINT_ACCOUNT_IMAGES
} from  "/js/constants.js";
import {GetCurrentAccount} from "/js/utils.js";

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
        redirect:"follow"
    };

    const response = await fetch(ENDPOINT_ACCOUNT_IMAGE_COUNT, requestOptions);
    return await response.json();
}

async function FetchAccountImages(page = 0) {
    let headers = new Headers();
    headers.append("Authorization", "Bearer "+GetCurrentAccount().accessToken);

    const requestOptions = {
        method:"GET",
        headers:headers,
        redirect:"follow"
    };

    const endpoint = ENDPOINT_ACCOUNT_IMAGES.replace("{{page}}", page);
    const response = await fetch(endpoint, requestOptions);
    return await response.json();
}