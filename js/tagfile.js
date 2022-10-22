export {
    GetAllTagData,
    AddTag,
    RemoveTag,
    SetJsonTags
}

let jsonTags = {};

function GetAllTagData() {
    return jsonTags;
}

function AddTag(mediaId, tag) {
    if(!jsonTags[mediaId]) {
        jsonTags[mediaId] = {};
        jsonTags[mediaId].tags = [];
    }
        
    jsonTags[mediaId].tags.push(tag);
}

function RemoveTag(mediaId, tag) {
    if(jsonTags[mediaId])
        jsonTags[mediaId].tags = jsonTags[mediaId].tags.filter(e => e !== tag);
}

function SetJsonTags(jsonData) {
    jsonTags = jsonData;
}