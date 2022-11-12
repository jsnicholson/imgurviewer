import { app } from "/js/App.js";
import { TEXT_SIGNED_IN_AS } from "/js/Constants.js";

export {
    Init,
    ChangeSourceToLoggedIn
}

function Init() {
    document.addEventListener("eventAccountLoggedIn", () => {ChangeSourceToLoggedIn()});
    document.addEventListener("eventAccountLoggedOut", () => {ChangeSourceToLoggedOut()});
}

function ChangeSourceToLoggedIn() {
    const buttonAuthorise = document.getElementById("buttonAuthorise");
    const buttonLogOut = document.getElementById("buttonLogOut");
    buttonAuthorise.setAttribute("hidden","");
    buttonLogOut.removeAttribute("hidden");

    const textAccount = document.getElementById("paragraphAccount");
    const text = TEXT_SIGNED_IN_AS.replace("{username}", app.GetContext().account.details.username);
    textAccount.textContent = text;
}

function ChangeSourceToLoggedOut() {

}