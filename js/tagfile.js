export {
    GetAllTagData,
    AddTag,
    RemoveTag,
    SetJsonTags
}

import { CountObjectKeys } from "/js/utils.js";

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

    if(!CountObjectKeys(jsonTags))
        delete jsonTags[mediaId];
}

function SetJsonTags(jsonData) {
    jsonTags = jsonData;
}