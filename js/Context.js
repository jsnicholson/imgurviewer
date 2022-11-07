import {Resolve} from "/js/Resolve.js";

export class Context {
    #_imgurRepository;
    #_mediaHandler;
    #_gallery;
    #_options;
    #_tagStorage;

    constructor() {
        this.#_imgurRepository = Resolve("ImgurRepository");
        this.#_mediaHandler = Resolve("MediaHandler");
        this.#_gallery = Resolve("Gallery");
        this.#_options = Resolve("Options");
        this.#_tagStorage = Resolve("TagStorage");
    }

    ImgurRepository() { return this.#_imgurRepository; }
    MediaHandler() { return this.#_mediaHandler; }
    Gallery() { return this.#_gallery; }
    Options() { return this.#_options; }
    TagStorage() { return this.#_tagStorage; }
}