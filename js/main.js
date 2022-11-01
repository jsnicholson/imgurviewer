import * as utils from "/js/utils.js";
import * as actions from "/js/actions.js";
import * as process from "/js/process.js";
import BsTags from "/vendor/bstags/js/tags.js";
import * as tags from "/js/tagfile.js";

window.onload = function() {
    utils.HandleParams();
    
    if(utils.GetCurrentAccount() != null)
        utils.LoggedIn();
    else
        utils.LoggedOut();

    MakeFunctionsAccessible();
    SetupEventListeners();
    SetupKeyHandlers();

    BsTags.init("select[multiple]");

    utils.LoadTagFileIfSelected();
}

function MakeFunctionsAccessible() {
    // make functions accessible to main html
    window.Authorise = function() {
        actions.ActionAuthorise();
    }

    window.LoadAccountImages = function() {
        actions.ActionLoadAccountImages();
    }

    window.LoadAlbumImages = function() {
        utils.ShowToast("danger", "Could not perform action");
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

    window.ClearTagFileInput = function() {
        document.getElementById("inputTagFile").value="";
    }

    window.MergeTagFile = function() {
        
    }

    window.OverwriteTagFile = function() {
        utils.LoadTagFileIfSelected();
    }
}

function SetupEventListeners() {
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

    document.getElementById("content-gallery").addEventListener("eventPageOfResultsLoaded", (event) =>
        process.HandleEventPageOfResultsLoaded(event));

    document.getElementById("inputAlbumId").addEventListener("input", (event) =>
        process.HandleInputAlbumIdChange(event));

    document.getElementById("sectionContentFullscreen").addEventListener("click", (event) => {
            if(event.target.id == "fullscreenMediaDetails" || 
                utils.IsChildOf(event.target, document.getElementById("fullscreenMediaDetails")) ||
                event.target.classList.contains("dropdown-item"))
                return;

            utils.HideFullscreenMedia();
            utils.EnableScroll();
        });

    document.getElementById("selectTagsMedia").addEventListener("eventTagAdded", (event) => {
        tags.AddTag(event.detail.id, event.detail.tag);
    });

    document.getElementById("selectTagsMedia").addEventListener("eventTagRemoved", (event) => {
        tags.RemoveTag(event.detail.id, event.detail.tag);
    });

    document.getElementById("inputTagFile").onchange = () => {
        actions.ActionImportJsonTagFile();
    };

    document.getElementById("selectGlobalTags").addEventListener("eventGlobalTagAdded", (event) => {
        utils.AddGlobalTag(event.detail.tag);
    });

    document.getElementById("selectGlobalTags").addEventListener("eventGlobalTagRemoved", (event) => {
        utils.RemoveGlobalTag(event.detail.tag);
    });

    document.getElementById("checkAutoLoadMoreMedia").addEventListener("change", (event) => {
       if(process.GetIsReadyForMoreMedia())
        document.getElementById("buttonLoadMoreMedia").removeAttribute("hidden"); 
    });
}

function SetupKeyHandlers() {
    document.addEventListener("keydown", (event) => {
        // only apply these key press actions if we're in fullscreen media
        const dropdown = document.querySelector(".form-control[for=selectTagsMedia] .dropdown-menu");
        if(utils.IsFullscreenMediaOpen() && !dropdown.classList.contains("show")) {
            switch(event.code) {
                case "Escape":
                    utils.HideFullscreenMedia();
                    utils.EnableScroll();
                    break;
                case "ArrowUp":
                    {
                        const currentMedia = utils.GetCurrentFullscreenMedia();
                        const prevMedia = process.GetPreviousMedia(currentMedia);
                        if(currentMedia != prevMedia)
                            actions.ActionOpenFullscreenMedia(prevMedia);
                    }
                    break;
                case "ArrowDown":
                    {
                        const currentMedia = utils.GetCurrentFullscreenMedia();
                        const nextMedia = process.GetNextMedia(currentMedia);
                        if(currentMedia != nextMedia)
                            actions.ActionOpenFullscreenMedia(nextMedia);
                    }
                    break;
                default:
                    break;
            }
        }
    });
}