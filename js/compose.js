export {
    ComposeContentColumns
};

import * as build from "/js/build.js";

function ComposeContentColumns(numCols) {
    let containerContent = document.getElementById("content-gallery");
    let cols = build.BuildContentColumns(numCols);
    for(const col of cols)
        containerContent.appendChild(col);
}