export {
    CreateEventPageOfResultsLoaded,
    CreateEventTagAdded,
    CreateEventTagRemoved,
    CreateEventGlobalTagAdded,
    CreateEventGlobalTagRemoved
};

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