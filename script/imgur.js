const clientId="058c8bb3e94cc6d";
const endpointAlbum="https://api.imgur.com/3/album/{{albumHash}}/images";
const endpointAlbumInfo="https://api.imgur.com/3/album/{{albumHash}}";
const endpointAuthorize="https://api.imgur.com/oauth2/authorize?client_id={{clientId}}&response_type=token";
const endpointAccessToken="https://api.imgur.com/oauth2/token";
const endpointAccountImages="https://api.imgur.com/3/account/me/images/{{page}}";
const endpointAccountImageCount="https://api.imgur.com/3/account/me/images/count";
const endpointUploadImage="https://api.imgur.com/3/image";

// returns an array of images from the specified album
async function FetchAlbumImages(albumId)
{
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Client-ID " + clientId);

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    var endpoint = endpointAlbum.replace("{{albumHash}}", albumId);

    let response = await fetch(endpoint, requestOptions);
    let data = await response.json();
    return data;
}

async function FetchAlbumInfo(albumId)
{
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Client-ID " + clientId);

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    var endpoint = endpointAlbumInfo.replace("{{albumHash}}", albumId);

    let response = await fetch(endpoint, requestOptions);
    let data = await response.json();
    return data;
}

// returns the number of images uploaded by the authenticated account
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

// returns an array of images from a single page, uploaded by the authed account
async function FetchAccountImages(page = 0)
{
    console.log("fetching account images");
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

// uploads an image to the authed account via a direct file link
async function UploadImageURL(imageURL)
{
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + GetCurrentAccount().accessToken);

    var formdata = new FormData();
    formdata.append("image", imageURL);
    formdata.append("type", "url");

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
    };

    var endpoint = endpointUploadImage;

    let response = await fetch(endpoint, requestOptions);
    let data = await response.json();
    return data;
}

// entry point for loading an album
async function ActionLoadAlbum()
{
    // pull the album id from the input box
    var input = document.getElementById("inputLoadAlbum").value;
    var startOfId = input.indexOf("a/");
    var albumId = input.substr(startOfId + 2);

    var albumImages;
    // if we ran this request previously, use that output instead of requesting again
    if("a/"+albumId == jsonPreviousResponse.input)
        albumImages = jsonPreviousResponse.json;
    // otherwise, go fetch the images
    else
        albumImages = await FetchAlbumImages(albumId);

    // fetch information about the album
    var albumInfo = await FetchAlbumInfo(albumId);
    console.log(albumInfo.data.title);

    // fill the grid with images
    PopulateImages(albumImages.data);

    // save the response
    jsonPreviousResponse.input = "a/" + albumId;
    jsonPreviousResponse.json = albumImages;
    //console.log(window.location.href + "a/" + albumId);
    //history.pushState({id:"album"}, document.title, window.location.href + "a/" + albumId);
}

// entry point for loading account images
async function ActionLoadAccountImages()
{
    // figure out how many pages we have to go through
    var imageCount = (await FetchAccountImageCount()).data;
    var pages = Math.ceil(imageCount/50);
    var allImages = [];

    // if we ran this request previously, use that ouput instead of requesting again
    if("u/"+GetCurrentAccount().username == jsonPreviousResponse.input)
        allImages = jsonPreviousResponse.json;
    // otherwise, loop all pages and add all responses to an array
    else
    {
        // make progress row visible
        var rowProgress = document.getElementById("row-progress");
        rowProgress.removeAttribute("hidden");

        for(var i = 0; i < pages; i++)
        {
            SetProgress("Pages: ", i, pages);

            var page = (await FetchAccountImages(i));
            var pageImages = (page).data;
            // append this pages images to the array
            allImages = allImages.concat(pageImages);
        }

        // reverse as we account fetches from newest to oldest
        allImages.reverse();
    }

    // fill grid with images
    PopulateImages(allImages);

    // save the response
    jsonPreviousResponse.input = "u/" + GetCurrentAccount().username;
    jsonPreviousResponse.json = allImages;
}

// entry point for uploading an image to the authed account with a direct file link
async function ActionUploadImageURL()
{
    var input = document.getElementById("inputUploadImage").value;
    var imageDirectURL = GetDirectImageURL(input);
    // if direct link failed that means we cant fetch it, let it handle the error
    if(!imageDirectURL){return false;}

    var response = await UploadImageURL(imageDirectURL);

    var responseSuccess = response.success;
    if(responseSuccess == true)
        AlertSuccess("Image uploaded successfully!");
    else
        AlertError("Error " + response.status + " : " + response.data.error.message);

    document.getElementById("inputUploadImage").value = "";
}

function ActionReaccess()
{
    
}

// entry point for authorizing an account
function ActionAuthorize()
{
    var endpoint = endpointAuthorize.replace("{{clientId}}", clientId);
    window.location = endpoint;
}

// entry point for removing the current account
function ActionLogout()
{
    localStorage.setItem("current_account", null);
    LoggedOut();
}