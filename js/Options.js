export class Options {
    sortOrder;
    checkAutomaticallyLoadMoreMedia;
    checkOnlyAddMediaOnceLoaded;
    checkAlwaysReadyForMoreMedia;

    Init() {
        let elemSortOrder = document.getElementById("selectSortOrder");
        let elemAutomaticallyLoadMoreMedia = document.getElementById("checkAutoLoadMoreMedia");
        let elemOnlyAddMediaOnceLoaded = document.getElementById("checkOnlyAddMediaOnceLoaded");
        let elemAlwaysReadyForMoreMedia = document.getElementById("checkAlwaysReadyForMoreMedia");

        // set initial values
        this.sortOrder = elemSortOrder.value;
        this.checkAutomaticallyLoadMoreMedia = elemAutomaticallyLoadMoreMedia.checked;
        this.checkOnlyAddMediaOnceLoaded = elemOnlyAddMediaOnceLoaded.checked;
        this.checkAlwaysReadyForMoreMedia = elemAlwaysReadyForMoreMedia.checked;

        // set event listeners
        elemSortOrder.addEventListener("change", (event) => {
            this.sortOrder = event.currentTarget.value;
        });

        elemAutomaticallyLoadMoreMedia.addEventListener("change", (event) => {
            this.checkAutomaticallyLoadMoreMedia = event.currentTarget.checked;
        });

        elemOnlyAddMediaOnceLoaded.addEventListener("change", (event) => {
            this.checkOnlyAddMediaOnceLoaded = event.currentTarget.checked;
        });

        elemAlwaysReadyForMoreMedia.addEventListener("change", (event) => {
            this.checkAlwaysReadyForMoreMedia = event.currentTarget.checked;
        })
    }
}