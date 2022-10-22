import * as utils from "/imgurviewer/js/utils.js";
import * as actions from "/imgurviewer/js/actions.js";
import * as process from "/imgurviewer/js/process.js";
import BsTags from "/imgurviewer/vendor/bstags/js/tags.js";
import * as tags from "/imgurviewer/js/tagfile.js";

window.onload = function() {
    utils.HandleParams();
    
    if(utils.GetCurrentAccount() != null)
        utils.LoggedIn();
    else
        utils.LoggedOut();

    SetupEventListeners();

    BsTags.init("select[multiple]");

    utils.LoadTagFileIfSelected();
}

window.addEventListener('scroll', ()=> {
    if(utils.GetDisplayOptions().automaticallyLoadMoreMedia) {
        if(window.innerHeight+window.scrollY>=document.body.offsetHeight-1000&&(process.GetIsReadyForMoreMedia() == true)){
            process.SetIsReadyForMoreMedia(false);
            actions.ActionLoadMoreMedia();
        }
    }
});

window.addEventListener('scroll', ()=> {
    if(document.body.scrollTop > 20 || document.documentElement.scrollTop > 20)
        document.getElementById("btnBackToTop").style.display = "block";
    else
        document.getElementById("btnBackToTop").style.display = "none";
});

// make functions accessible to main html
window.Authorise = function() {
    actions.ActionAuthorise();
}

window.LoadAccountImages = function() {
    actions.ActionLoadAccountImages();
}

window.LoadAlbumImages = function() {
    actions.ActionLoadAlbumImages();
}

window.LogOut = function() {
    actions.ActionLogOut();
}

window.ScrollToTop = function() {
    utils.ScrollToTop();
}

window.LoadMoreMedia = function() {
    document.getElementById("buttonLoadMoreMedia").setAttribute("hidden","");
    actions.ActionLoadMoreMedia();
}

window.DismissAlert = function(alert) {
    alert.parentNode.setAttribute("hidden","");
}

window.DownloadTagFile = function() {
    actions.ActionDownloadTagFile();
}

function SetupEventListeners() {
    document.querySelector("#content-gallery").addEventListener("eventPageOfResultsLoaded", (event) =>
        process.HandleEventPageOfResultsLoaded(event));

    document.querySelector("#inputAlbumId").addEventListener("input", (event) =>
        process.HandleInputAlbumIdChange(event));

    document.querySelector("#sectionContentFullscreen").addEventListener("click", (event) => {
            if(event.target.id == "fullscreenMediaDetails" || utils.IsChildOf(event.target, "fullscreenMediaDetails"))
                return;
            
            document.querySelector("#sectionContentFullscreen").setAttribute("hidden","");
            utils.EnableScroll();
        });

    document.querySelector("#selectTagsMedia").addEventListener("eventTagAdded", (event) => {
        tags.AddTag(event.detail.id, event.detail.tag);
    });

    document.querySelector("#selectTagsMedia").addEventListener("eventTagRemoved", (event) => {
        tags.RemoveTag(event.detail.id, event.detail.tag);
    });

    document.querySelector("#inputTagFile").onchange = () => {
        utils.LoadTagFileIfSelected();
    };
}