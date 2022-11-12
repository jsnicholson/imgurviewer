import {
    Authorise,
    FetchAccountImageCount,
    FetchPageOfAccountImages
} from "/js/ImgurRepository.js"

export class ImgurService {
    #abortController;

    constructor() {
        this.#abortController = new AbortController();
    }

    AbortExistingCalls() {
        this.#abortController.abort();
        
    }
}