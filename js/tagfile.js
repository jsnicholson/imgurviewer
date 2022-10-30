export {
    GetAllTagData,
    AddTag,
    RemoveTag,
    SetJsonTags
}

import { CountObjectKeys } from "/imgurviewer/js/utils.js";
import { CreateEventGlobalTagAdded, CreateEventGlobalTagRemoved } from "/imgurviewer/js/events.js";

let jsonData = {tags:[],media:{}};

function GetAllTagData() {
    return jsonData;
}

function AddTag(mediaId, tag) {
    if(!jsonData.media[mediaId]) {
        jsonData.media[mediaId] = {};
        jsonData.media[mediaId].tags = [];
    }
        
    jsonData.media[mediaId].tags.push(tag);
    jsonData.media[mediaId].tags.sort((a, b) => a.localeCompare(b))

    // if tag isnt in the global list, add it and sort alphabetically
    // also dispatch an event so that the global tag picker can update itself
    if(!jsonData.tags.includes(tag)) {
        jsonData.tags.push(tag);
        jsonData.tags.sort((a, b) => a.localeCompare(b));
        const event = CreateEventGlobalTagAdded(tag);
        document.getElementById("selectGlobalTags").dispatchEvent(event);
    }
}

function RemoveTag(mediaId, tag) {
    if(jsonData.media[mediaId])
        jsonData.media[mediaId].tags = jsonData.media[mediaId].tags.filter(e => e !== tag);

    if(!CountObjectKeys(jsonData))
        delete jsonData.media[mediaId];

    // if the tag isnt in the global list, remove it
    // also dispatch an event so that the global tag picker can update itself
    if(!JSON.stringify(jsonData.media).includes(tag)) {
        jsonData.tags = jsonData.tags.filter(e => e !== tag);
        const event = CreateEventGlobalTagRemoved(tag);
        document.getElementById("selectGlobalTags").dispatchEvent(event);
    }
}

function SetJsonTags(newJsonData) {
    jsonData = newJsonData;
}