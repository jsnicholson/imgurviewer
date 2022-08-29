/*
    actions.js holds functions for functions directly started from user input, ie. button clicks or scrolls
*/

export {
    ActionAuthorise,
    ActionLoadAccountImages,
    ActionLogOut,
    ActionLoadMoreMedia,
};

import * as imgur from "/imgurviewer/js/imgur.js";
import * as constants from "/imgurviewer/js/constants.js";
import * as utils from "/imgurviewer/js/utils.js";
import * as process from "/imgurviewer/js/process.js";
import * as repository from "/imgurviewer/js/repository.js";

function ActionAuthorise() {
    imgur.Authorise();
}

async function ActionLoadAccountImages() {
    repository.AbortExistingCallsIfExist();
    process.InitMediaObj();
    utils.ClearContent();
    utils.SetupContentColumns();
    utils.ChangeText(constants.TEXTMAP_ACTION_LOAD_ACCOUNT_IMAGES);

    repository.GetAllAccountImagesWithSortOrder();
}

function ActionLoadMoreMedia() {
    process.LoadMoreMedia();
}

function ActionLogOut() {
    localStorage.setItem("current_account", null);
    utils.LoggedOut();
}