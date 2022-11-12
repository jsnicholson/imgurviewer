/*
    app.js is the main runner for the application
*/

import { Context } from "/js/Context.js";
import { BuildAccountDetailsObject } from "/js/Account.js";
import { CreateEventAccountAuthorised } from "/js/Events.js";
import { Init as Init_Dom } from "/js/Dom.js";

class App {
    context={};

    Run() {
        this.context = new Context();
        this.context.Init();

        this.#HandleWindowParams();
    }

    GetContext() { return this.context; }

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
    /*
        some event listeners in other files to keep responsibility separate
        call a function on these files to initialise these listeners
    */
    Init_Dom();
    // run app after initialising to separate functionality from constructor
    app.Run();
}