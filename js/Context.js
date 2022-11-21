import { ImgurService } from "/js/ImgurService.js";
import { MediaHandler } from "/js/MediaHandler.js";
import { Gallery } from "/js/Gallery.js";
import { Options } from "/js/Options.js";
import { TagStorage } from "/js/TagStorage.js";
import { Account } from "/js/Account.js";

export class Context {
    imgurService;
    mediaHandler;
    gallery;
    options;
    tagStorage;
    account;

    constructor() {
        this.imgurService = new ImgurService();
        this.mediaHandler = new MediaHandler();
        this.gallery = new Gallery();
        this.options = new Options();
        this.tagStorage = new TagStorage();
        this.account = new Account();
    }

    Init() {
        this.options.Init();
        this.account.Init();

        document.addEventListener("eventAccountChanged", () => {this.#ReloadAccount()});
    }

    #ReloadAccount() {
        this.account = new Account();
        this.account.Init();
    }
}
