export {
    CreateEventAccountAuthorised,
    CreateEventAccountLoggedIn,
    CreateEventAccountLoggedOut,
    CreateEventPageOfResultsLoaded,
    CreateEventTagAdded,
    CreateEventTagRemoved,
    CreateEventGlobalTagAdded,
    CreateEventGlobalTagRemoved
};

const mapEvents = new Map([
    ["eventAccountAuthorised", ["account"]],
    ["eventAccountLoggedIn",[]],
    ["eventAccountLoggedOut",[]],
    ["eventPageOfResultsLoaded",["pageOfResultsLoaded"]],
    ["eventTagAdded",["tagName","mediaId"]],
    ["eventTagRemoved",["tagName","mediaId"]],
    ["eventGlobalTagAdded",["tagName"]],
    ["eventGlobalTagRemoved",["tagName"]]
]);

function CreateEvent(eventName, data) {
    const elements = mapEvents.get(eventName);
    let detail = {};
    for(const element of elements) {

    }
}

function CreateEventAccountAuthorised(objAccountDetails) {
    return new CustomEvent("eventAccountAuthorised", {
        detail: {
            account:objAccountDetails
        }
    });
}

function CreateEventAccountLoggedIn() {
    return new CustomEvent("eventAccountLoggedIn");
}

function CreateEventAccountLoggedOut() {
    return new CustomEvent("eventAccountLoggedOut");
}

function CreateEventPageOfResultsLoaded(data) {
    return new CustomEvent("eventPageOfResultsLoaded", {
        detail: {
            pageOfResultsLoaded:data,
        }
    });
}

function CreateEventTagAdded(tagName, mediaId) {
    return new CustomEvent("eventTagAdded", {
        detail: {
            id: mediaId,
            tag: tagName
        }
    });
}

function CreateEventTagRemoved(tagName, mediaId) {
    return new CustomEvent("eventTagRemoved", {
        detail: {
            id: mediaId,
            tag: tagName
        }
    });
}

// event for when a tag is added to the global tag list
function CreateEventGlobalTagAdded(tagName) {
    return new CustomEvent("eventGlobalTagAdded", {
        detail: {
            tag: tagName
        }
    });
}

function CreateEventGlobalTagRemoved(tagName) {
    return new CustomEvent("eventGlobalTagRemoved", {
        detail: {
            tag: tagName
        }
    });
}