export {
    Account,
    BuildAccountDetailsObject,
    RemoveAccount,
}

import { STORAGE_ITEM_ACCOUNT_IMGUR } from "/js/Constants.js";
import { CreateEventAccountIsLoggedIn, CreateEventAccountIsLoggedOut, CreateEventAccountChanged } from "/js/events.js";

class Account {
    /* details format
        {
            username,
            id,
            tokenAccess,
            tokenRefresh,
            dateExpiry
        }
    */
    details = null;

    constructor() {
        this.details = JSON.parse(window.localStorage.getItem(STORAGE_ITEM_ACCOUNT_IMGUR));
        Object.freeze(this.details);
    }

    Init() {
        if(this.details != null) {
            const event = CreateEventAccountIsLoggedIn();
            document.dispatchEvent(event);
        } else {
            const event = CreateEventAccountIsLoggedOut();
            document.dispatchEvent(event);
        }
    }
}

function BuildAccountDetailsObject(params) {
    return {
        username:params.get("account_username"),
        id:params.get("account_id"),
        tokenAccess:params.get("access_token"),
        tokenRefresh:params.get("refresh_token"),
        dateExpiry:Date.now()+params.get("expires_in")
    }
}

document.addEventListener("eventAccountAuthorised", (event) => { StoreAccount(event.detail.account) });
function StoreAccount(objAccountDetails) {
    window.localStorage.setItem(STORAGE_ITEM_ACCOUNT_IMGUR, JSON.stringify(objAccountDetails));
    const event = CreateEventAccountChanged();
    document.dispatchEvent(event);
}

function RemoveAccount() {
    window.localStorage.setItem(STORAGE_ITEM_ACCOUNT_IMGUR, null);
    const event = CreateEventAccountChanged();
    document.dispatchEvent(event);
}