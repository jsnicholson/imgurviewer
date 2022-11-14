export {
    Account,
    BuildAccountDetailsObject,
    StoreAccount,
}

import { STORAGE_ITEM_ACCOUNT_IMGUR } from "/js/Constants.js";
import { ActionAuthorise, ActionLogOut } from "/js/actions.js";
import { CreateEventAccountLoggedIn } from "/js/events.js";

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
            const event = CreateEventAccountLoggedIn();
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

function StoreAccount(objAccountDetails) {
    window.localStorage.setItem(STORAGE_ITEM_ACCOUNT_IMGUR, JSON.stringify(objAccountDetails));
}

window.Authorise = function() {
    ActionAuthorise();
}

window.LogOut = function() {
    ActionLogOut();
}