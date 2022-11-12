import { ImgurRepository } from "/js/ImgurRepository.js";
import { MediaHandler } from "/js/MediaHandler.js";
import { Gallery } from "/js/Gallery.js";
import { Options } from "/js/Options.js";
import { TagStorage } from "/js/TagStorage.js";
import { Account, StoreAccount } from "/js/Account.js";

export class Context {
    imgurRepository;
    mediaHandler;
    gallery;
    options;
    tagStorage;
    account;

    constructor() {
        this.imgurRepository = new ImgurRepository();
        this.mediaHandler = new MediaHandler();
        this.gallery = new Gallery();
        this.options = new Options();
        this.tagStorage = new TagStorage();
        this.account = new Account();
    }

    Init() {
        this.options.Init();
        this.account.Init();

        document.addEventListener("eventAccountAuthorised", (event) => {this.#StoreAccountAndReload(event)});
    }

    #StoreAccountAndReload(event) {
        StoreAccount(event.detail.account);
        this.account = new Account();
        this.account.Init();
    }
}
