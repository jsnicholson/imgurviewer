export {
    Account,
    BuildAccountDetailsObject,
    StoreAccount
}

import {STORAGE_ITEM_ACCOUNT_IMGUR} from "/js/Constants.js";

class Account {
    details = null;

    constructor() {
        details = JSON.parse(window.localStorage.getItem(STORAGE_ITEM_ACCOUNT_IMGUR));
        Object.freeze(details);
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