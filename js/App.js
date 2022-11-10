/*
    app.js is the main runner for the application
*/

import {Context} from "/js/Context.js";
import {BuildAccountDetailsObject} from "/js/Account.js";
import {CreateEventAccountAuthorised} from "/js/Events.js";

class App {
    _context={};

    constructor() {
        this._context = new Context();
        this.#HandleWindowParams();
    }

    GetContext() { return this._context; }

    #GetWindowParams() {
        let completeUrl = new URL(window.location.href.replace("#","?"));
        return new URLSearchParams(completeUrl.search);
    }

    // deal with window parameters, raise events or delegate where necessary
    #HandleWindowParams() {
        const params = this.#GetWindowParams();

        if(params.has("account_id")) {
            const objAccountDetails = BuildAccountDetailsObject(params);
            const event = CreateEventAccountAuthorised(objAccountDetails);
            document.dispatchEvent(event);
        }
    }
}

const singleton = new App();
export default singleton;