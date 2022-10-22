export {
    CreateEventPageOfResultsLoaded,
    CreateEventTagAdded,
    CreateEventTagRemoved
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