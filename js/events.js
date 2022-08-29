export {
    DispatchEventPageOfResultsLoaded,
};

function DispatchEventPageOfResultsLoaded(data, pageNumberLoaded) {
    const event = new CustomEvent("eventPageOfResultsLoaded", {
        detail: {
            pageOfResultsLoaded:data,
            pageNumberLoaded:pageNumberLoaded
        }
    });
    document.querySelector("#content-gallery").dispatchEvent(event);
}