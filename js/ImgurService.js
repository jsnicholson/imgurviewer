import {
    Authorise,
    FetchAccountImageCount,
    FetchPageOfAccountImages
} from "/js/ImgurRepository.js"
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

    async #GetPageOfAccountImages(intPage) {
        const data = {
            signalAbort: this.#abortController.abortSignal,
            tokenAccess: app.GetContext().account.tokenAccess
        };

        return await FetchPageOfAccountImages(data);
    }
}