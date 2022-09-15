export {
    DispatchEventPageOfResultsLoaded,
};

function DispatchEventPageOfResultsLoaded(data) {
    const event = new CustomEvent("eventPageOfResultsLoaded", {
        detail: {
            pageOfResultsLoaded:data,
        }
    });
    document.querySelector("#content-gallery").dispatchEvent(event);
}