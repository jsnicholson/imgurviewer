import {
    Authorise,
    FetchAccountImageCount,
    FetchPageOfAccountImages
} from "/js/ImgurRepository.js"
import { PAGE_SIZE_IMGUR } from "/js/Constants.js";
import { app } from "/js/App.js";

export class ImgurService {
    #abortController;
    #arrayResults;

    constructor() {
        this.#InitAbortController();
        this.#arrayResults = [];
    }

    #InitAbortController() {
        this.#abortController = new AbortController();
    }

    AbortExistingCalls() {
        this.#abortController.abort();
        this.#InitAbortController();
    }

    // simply pass on the call to the repository as no further processing is needed
    Authorise() {
        Authorise();
    }

    async GetAllAccountImages() {
        const imageCount = await this.#GetAccountPageCount();
    }

    async #GetAccountPageCount() {
        const imageCount = await FetchAccountImageCount();
        return Math.ceil(imageCount/PAGE_SIZE_IMGUR);
    }

    async #GetPageOfAccountImages(intPage) {
        const data = {
            signalAbort: this.#abortController.abortSignal,
            tokenAccess: app.context.account.tokenAccess,
            intPage: intPage
        };

        return await FetchPageOfAccountImages(data);
    }
}