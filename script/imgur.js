const clientId="058c8bb3e94cc6d";
const endpointAlbum="https://api.imgur.com/3/album/{{albumId}}/images";
const endpointAuthorize="https://api.imgur.com/oauth2/authorize?client_id={{clientId}}&response_type=token";
const endpointAccessToken="https://api.imgur.com/oauth2/token";
const endpointAccountImages="https://api.imgur.com/3/account/me/images/{{page}}";
const endpointAccountImageCount="https://api.imgur.com/3/account/me/images/count";

function FetchAlbumImages(albumId)
{
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Client-ID " + clientId);

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    var endpoint = endpointAlbum.replace("{{albumId}}", albumId);

    fetch(endpoint, requestOptions)
    .then(response => response.text())
    .then(result => PopulateImages(JSON.parse(result).data))
    .catch(error => console.log('error', error));
}

async function FetchAccountImageCount()
{
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + GetCurrentAccount().accessToken);

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    let response = await fetch(endpointAccountImageCount, requestOptions);
    let data = await response.json();
    return data;
}

async function FetchAccountImages(page = 0)
{
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + GetCurrentAccount().accessToken);

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    var endpoint = endpointAccountImages.replace("{{page}}", page);

    let response = await fetch(endpoint, requestOptions);
    let data = await response.json();
    return data;
}

function ActionLoadAlbum()
{
    var input = document.getElementById("inputLoadAlbum").value;

    ClearContent();

    var startOfId = input.indexOf("a/");
    var albumId = input.substr(startOfId + 2);
    FetchAlbumImages(albumId);
    //console.log(window.location.href + "a/" + albumId);
    //history.pushState({id:"album"}, document.title, window.location.href + "a/" + albumId);
}

async function ActionLoadAccountImages()
{
    ClearContent();
    
    var imageCount = (await FetchAccountImageCount()).data;
    var pages = Math.ceil(imageCount/50);
    var allImages = [];

    for(var i = 0; i < pages; i++)
    {
        var page = (await FetchAccountImages(i));
        var pageImages = (page).data;
        allImages = allImages.concat(pageImages);
    }

    //console.log(allImages);
    allImages.reverse();
    PopulateImages(allImages, 50);
}

function ActionReaccess()
{
    
}

function ActionAuthorize()
{
    var endpoint = endpointAuthorize.replace("{{clientId}}", clientId);
    window.location = endpoint;
}

function ActionLogout()
{
    localStorage.setItem("current_account", null);
    LoggedOut();
}

function LoggedIn()
{
    document.getElementById("form-account-loggedin").removeAttribute("hidden");
    document.getElementById("form-account-loggedout").setAttribute("hidden", "");
    document.getElementById("label-current-account").textContent = GetCurrentAccount().username;
}

function LoggedOut()
{
    document.getElementById("form-account-loggedout").removeAttribute("hidden");
    document.getElementById("form-account-loggedin").setAttribute("hidden", "");
}