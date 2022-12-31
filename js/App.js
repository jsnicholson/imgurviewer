/*
    app.js is the main runner for the application
*/

import { Context } from "/js/Context.js";
import { BuildAccountDetailsObject } from "/js/Account.js";
import { CreateEventAccountAuthorised } from "/js/Events.js";
// some files imported so that code outside classes (usually for setting up listeners) is run
import * as Dom from "/js/Dom.js";
import * as Actions from "/js/Actions.js";

class App {
    context={};

    Run() {
        this.context = new Context();
        this.context.Init();

        this.#HandleWindowParams();
    }

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
            history.replaceState("","", window.location.pathname + window.location.search);
        }
    }
}


const app = new App();
export { app };

window.onload = function() {
    // run app after initialising to separate functionality from constructor
    app.Run();
}