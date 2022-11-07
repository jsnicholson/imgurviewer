/*
    imgur repository makes direct calls to imgur api
    has state in abort controller but this is handled internally
*/

import {
    CLIENT_ID,
    ENDPOINT_AUTHORISE,
    ENDPOINT_ACCOUNT_IMAGE_COUNT,
    ENDPOINT_ACCOUNT_IMAGES,
    ENDPOINT_ALBUM_IMAGES,
} from  "/js/constants.js";
import { HandleError } from "/js/Error.js";

export class ImgurRepository {

    #abort = {controller:{},signal:{}};

    constructor() {
        this.#InitAbortSignal();
    }

    #InitAbortSignal() {
        this.#abort.controller = new AbortController();
        this.#abort.signal = this.#abort.controller.signal;
    }

    AbortExistingCalls() {
        this.#abort.controller.abort();
        this.#InitAbortSignal();
    }

    Authorise() {
        let endpointAuthoriseLocation = ENDPOINT_AUTHORISE.replace("{{clientId}}", CLIENT_ID);
        window.location = endpointAuthoriseLocation;
    }

    async FetchAccountImageCount(accessToken) {
        let headers = new Headers();
        headers.append("Authorization", "Bearer " + accessToken);
        const requestOptions = {
            method:"GET",
            headers:headers,
            redirect:"follow",
            signal:this.#abort.signal
        };

        const response = await fetch(ENDPOINT_ACCOUNT_IMAGE_COUNT, requestOptions).catch(e => HandleError(e));
        return await response?.json();
    }

    async FetchPageOfAccountImages(accessToken, page = 0) {
        let headers = new Headers();
        headers.append("Authorization", "Bearer "+ accessToken);

        const requestOptions = {
            method:"GET",
            headers:headers,
            redirect:"follow",
            signal:this.#abort.signal
        };

        const endpoint = ENDPOINT_ACCOUNT_IMAGES.replace("{{page}}", page);
        const response = await fetch(endpoint, requestOptions).catch(e => HandleError(e));
        return await response?.json();
    }

    async FetchPageOfAlbumImages(albumId, page = 0) {
        let headers = new Headers();
        headers.append("Authorization", "Bearer " + GetCurrentAccount().accessToken);

        const requestOptions = {
            method:"GET",
            headers:headers,
            redirect:"follow",
            signal:this.#abort.signal
        };

        const endpoint = ENDPOINT_ALBUM_IMAGES.replace("{{albumHash}}", id);
        const response = await fetch(endpoint, requestOptions).catch(e => HandleError(e));
        return await response?.json();
    }
}