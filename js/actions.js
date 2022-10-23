/*
    actions.js holds functions for functions directly started from user input, ie. button clicks or scrolls
*/

export {
    ActionAuthorise,
    ActionLoadAccountImages,
    ActionLoadAlbumImages,
    ActionLogOut,
    ActionLoadMoreMedia,
    ActionDownloadTagFile,
    ActionOpenFullscreenMedia,
    ActionImportJsonTagFile
};

import * as constants from "/js/constants.js";
import * as utils from "/js/utils.js";
import * as process from "/js/process.js";
import * as repository from "/js/repository.js";
import * as imgur from "/js/imgur.js";

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

function ActionDownloadTagFile() {
    const jsonTags = utils.GetJsonTags();
    const blobTags = utils.JsonDataToBlob(jsonTags);
    const username = utils.GetCurrentAccount().username;
    utils.DownloadBlob(blobTags, `${username}-tags.json`);
}

function ActionOpenFullscreenMedia(media) {
    utils.DisableScroll();
    utils.ResetFullscreenMedia();
    utils.SetFullscreenMedia(media);
    utils.ShowFullscreenMedia();
}

function ActionImportJsonTagFile() {
    // if there are already some tags, then we need to decide whether to merge or overwrite
    if(utils.CountObjectKeys(utils.GetJsonTags()))
        utils.OpenJsonMergeOrOverwriteModal();
    else
        utils.LoadTagFileIfSelected();
}