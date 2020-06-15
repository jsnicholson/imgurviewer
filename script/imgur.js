const clientId = "058c8bb3e94cc6d";
const albumRequestURL = "https://api.imgur.com/3/album/{{albumId}}/images";

function FetchAlbumImages(albumId)
{
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Client-ID " + clientId);
    //myHeaders.append("Authorization", "Bearer " + accessToken);


    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    var endpoint = albumRequestURL.replace("{{albumId}}", albumId);
    
    fetch(endpoint, requestOptions)
    .then(response => response.text())
    .then(result => PopulateImages(result))
    .catch(error => console.log('error', error));
}

function PullImagePathsFromJSON(json)
{
    var arrImagePaths = [];
    var parsed = JSON.parse(json).data;

    for(var i = 0; i < parsed.length; i++)
    {
        var obj = parsed[i];
        arrImagePaths.push([obj.link, obj.type]);
    }
    return arrImagePaths;
}

function PopulateImages(jsonResult)
{
    var arrImages = PullImagePathsFromJSON(jsonResult);
    shuffle(arrImages);

    for(var i = 0; i < arrImages.length; i++)
    {
        var imgPath = arrImages[i][0];
        var fileType = arrImages[i][1];

        if(fileType.includes("image"))
        {
            imageTags = "<img class='card-img-top' src='" + imgPath + "' id='newImage' loading='lazy'>";
        }
        else if(fileType.includes("video"))
        {
            imageTags = "<video autoplay muted loop class='card-img-top' loading='lazy'><source src='" + imgPath + "'></video>";
        }
        
        var col = document.getElementById("content-col-" + i%3);
        col.innerHTML += imageTags;

        /*var newImage = document.getElementById("newImage");
        newImage.onload = function(){
            columns[nextColumn] += this.height;
            console.log(this.height);
        }*/
        //console.log("col:" + nextColumn + " height:" + columns[nextColumn]);
        //newImage.removeAttribute('id');
        //console.log("nextColumn:" + nextColumn);
    }
    console.log("loaded all images");
}

function LoadAlbum()
{
    var input = document.getElementById("inputLoadAlbum").value;

    ClearContent();

    var startOfId = input.indexOf("a/");
    var albumId = input.substr(startOfId + 2);
    FetchAlbumImages(albumId);
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
  
      // swap elements array[i] and array[j]
      // we use "destructuring assignment" syntax to achieve that
      // you'll find more details about that syntax in later chapters
      // same can be written as:
      // let t = array[i]; array[i] = array[j]; array[j] = t
      [array[i], array[j]] = [array[j], array[i]];
    }
}

function ClearContent()
{
    for(var i = 0; i < 3; i++)
    {
        var col = document.getElementById("content-col-" + i);
        col.innerHTML = "";
    }
}