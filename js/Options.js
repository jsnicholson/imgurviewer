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
            console.log(this);
        });

        elemAutomaticallyLoadMoreMedia.addEventListener("change", (event) => {
            console.log("check auto load more media changed");
            this.checkAutomaticallyLoadMoreMedia = event.currentTarget.checked;
            console.log(this);
        });

        elemOnlyAddMediaOnceLoaded.addEventListener("change", (event) => {
            this.checkOnlyAddMediaOnceLoaded = event.currentTarget.checked;
            console.log(this);
        });

        elemAlwaysReadyForMoreMedia.addEventListener("change", (event) => {
            this.checkAlwaysReadyForMoreMedia = event.currentTarget.checked;
            console.log(this);
        })
    }
}