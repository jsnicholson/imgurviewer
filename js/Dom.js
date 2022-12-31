import { app } from "/js/App.js";
import { TEXT_SIGNED_IN_AS, TEXT_NOT_SIGNED_IN } from "/js/Constants.js";

export {
    ChangeSourceToLoggedIn
}

// call to set up listeners
Init();
function Init() {
    document.addEventListener("eventAccountIsLoggedIn", () => {ChangeSourceToLoggedIn()});
    document.addEventListener("eventAccountIsLoggedOut", () => {ChangeSourceToLoggedOut()});
}

function ChangeSourceToLoggedIn() {
    const buttonAuthorise = document.getElementById("buttonAuthorise");
    const buttonLogOut = document.getElementById("buttonLogOut");
    buttonAuthorise.setAttribute("hidden","");
    buttonLogOut.removeAttribute("hidden");

    const textAccount = document.getElementById("paragraphAccount");
    const text = TEXT_SIGNED_IN_AS.replace("{username}", app.context.account.details.username);
    textAccount.textContent = text;
}

function ChangeSourceToLoggedOut() {
    const buttonAuthorise = document.getElementById("buttonAuthorise");
    const buttonLogOut = document.getElementById("buttonLogOut");
    buttonAuthorise.removeAttribute("hidden");
    buttonLogOut.setAttribute("hidden","");

    const textAccount = document.getElementById("paragraphAccount");
    const text = TEXT_NOT_SIGNED_IN;
    textAccount.textContent = text;
}