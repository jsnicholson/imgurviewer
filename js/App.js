import {Context} from "/js/Context.js";

class App {
    _context={};

    constructor() {
        this._context = new Context();
    }

    GetContext() { return this._context; }
}

const singleton = new App();
export default singleton;