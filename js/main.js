import * as utils from "/js/utils.js";
import * as imgur from "/js/imgur.js";
import * as constants from "/js/constants.js";
import * as actions from "/js/actions.js";

window.onload = function() {
    utils.HandleParams();
    
    if(utils.GetCurrentAccount() != null)
        utils.LoggedIn();
    else
        utils.LoggedOut();
}

window.addEventListener('scroll', ()=> {
    if(window.innerHeight+window.scrollY>=document.body.offsetHeight-1000&&(actions.GetIsReadyForMoreMedia() == true)){
        actions.SetIsReadyForMoreMedia(false);
        actions.ActionLoadMoreMedia();
    }
});

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function(){
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        btnBackToTop.style.display = "block";
    } else {
        btnBackToTop.style.display = "none";
    }
};

window.addEventListener('scroll', ()=> {
    if(document.body.scrollTop > 20 || document.documentElement.scrollTop > 20)
        document.getElementById("btnBackToTop").style.display = "block";
    else
        document.getElementById("btnBackToTop").style.display = "none";
});

// make function accessible to main html
window.Authorise = function() {
    actions.ActionAuthorise();
}

window.LoadAccountImages = function() {
    actions.ActionLoadAccountImages();
}

window.LogOut = function() {
    actions.ActionLogOut();
}

window.ScrollToTop = function() {
    utils.ScrollToTop();
}