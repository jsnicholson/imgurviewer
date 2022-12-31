export {
    CreateEventAccountAuthorised,
    CreateEventAccountIsLoggedIn,
    CreateEventAccountIsLoggedOut,
    CreateEventAccountChanged,
    CreateEventPageOfResultsLoaded,
    CreateEventTagAdded,
    CreateEventTagRemoved,
    CreateEventGlobalTagAdded,
    CreateEventGlobalTagRemoved,
    CreateEventFileLoaded
};

const mapEvents = new Map([
    ["eventAccountAuthorised", ["account"]],
    ["eventAccountIsLoggedIn",[]],
    ["eventAccountIsLoggedOut",[]],
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
        if(!data[element])
            console.error(`event ${eventName} requires data '${element}' that has not been supplied`);
        detail[element] = data[element];
    }
}

function CreateEventAccountAuthorised(objAccountDetails) {
    return new CustomEvent("eventAccountAuthorised", {
        detail: {
            account:objAccountDetails
        }
    });
}

function CreateEventAccountIsLoggedIn() {
    return new CustomEvent("eventAccountIsLoggedIn");
}

function CreateEventAccountIsLoggedOut() {
    return new CustomEvent("eventAccountIsLoggedOut");
}

function CreateEventAccountChanged() {
    return new CustomEvent("eventAccountChanged");
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

function CreateEventFileLoaded() {
    return new CustomEvent("eventFileLoaded");
}