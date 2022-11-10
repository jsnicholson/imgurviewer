import {ImgurRepository} from "/js/ImgurRepository.js";
import {MediaHandler} from "/js/MediaHandler.js";
import {Gallery} from "/js/Gallery.js";
import {Options} from "/js/Options.js";
import {TagStorage} from "/js/TagStorage.js";

export class Context {
    #_imgurRepository;
    #_mediaHandler;
    #_gallery;
    #_options;
    #_tagStorage;

    constructor() {
        this.#_imgurRepository = new ImgurRepository();
        this.#_mediaHandler = new MediaHandler();
        this.#_gallery = new Gallery();
        this.#_options = new Options();
        this.#_tagStorage = new TagStorage();
    }

    ImgurRepository() { return this.#_imgurRepository; }
    MediaHandler() { return this.#_mediaHandler; }
    Gallery() { return this.#_gallery; }
    Options() { return this.#_options; }
    TagStorage() { return this.#_tagStorage; }
}