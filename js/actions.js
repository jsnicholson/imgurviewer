/*
    actions.js holds functions for functions directly started from user input, ie. button clicks or scrolls
*/

export {
    ActionAuthorise,
    ActionLoadAccountImages,
    ActionLoadAlbumImages,
    ActionLogOut,
    ActionLoadMoreMedia,
};

import * as constants from "/js/constants.js";
import * as utils from "/js/utils.js";
import * as process from "/js/process.js";
import * as repository from "/js/repository.js";

function ActionAuthorise() {
    imgur.Authorise();
}

async function ActionLoadAccountImages() {
    utils.SetupForMedia();
    utils.ChangeText(constants.TEXTMAP_ACTION_LOAD_ACCOUNT_IMAGES);
    repository.GetAllAccountImages();
}

async function ActionLoadAlbumImages() {
    utils.SetupForMedia();
    utils.ChangeText(constants.TEXTMAP_ACTION_LOAD_ACCOUNT_IMAGES);
    const albumId = utils.InputToAlbumId();
    repository.GetAllAlbumImages(albumId);
}

function ActionLoadMoreMedia() {
    process.LoadMoreMedia();
}

function ActionLogOut() {
    localStorage.setItem("current_account", null);
    utils.LoggedOut();
}