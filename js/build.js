export {
    BuildMediaWithSkeleton,
    BuildContentColumns
};

import * as process from "/imgurviewer/js/process.js";
import * as utils from "/imgurviewer/js/utils.js";

function BuildMediaWithSkeleton(fileInfo) {
    const container = document.createElement("div");
    container.classList.add("mediaContainer");
    container.classList.add("media-loading");
    let media = BuildMedia(fileInfo);
    let skeleton = BuildSkeletonMedia({width:fileInfo.width,height:fileInfo.height});
    container.append(media,skeleton);
    return container;
}

function BuildMedia(fileInfo) {
    let mediaNew;
    if(fileInfo.type.includes("image")) {
        mediaNew = BuildMediaImage(fileInfo);
    } else if (fileInfo.type.includes("video")) {
        mediaNew = BuildMediaVideo(fileInfo);
    }

    mediaNew.classList.add("media");

    return mediaNew;
}

function BuildMediaImage(fileInfo) {
    let imageNew = new Image();

    imageNew.onload = function() {
        process.SingleMediaLoaded(this);
    }

    if(fileInfo.type.includes("gif") && !utils.IsValidGifUrl(fileInfo.link))
        imageNew.src = fileInfo.gifv.slice(0,-1);
    else
        imageNew.src = fileInfo.link;

    return imageNew;
}

function BuildMediaVideo(fileInfo) {
    let videoNew = document.createElement("video");
    videoNew.onloadeddata = function() {
        process.SingleMediaLoaded(this);
    }

    videoNew.setAttribute("autoplay","");
    videoNew.setAttribute("loop","");
    videoNew.muted = true;

    if(fileInfo.type.includes("mp4"))
        videoNew.classList.add("media-mp4");

    videoNew.src = fileInfo.link;

    return videoNew;
}

function BuildSkeletonMedia(mediaDimensions) {
    let skeleton = document.createElement("div");
    skeleton.classList.add("skeleton-media");
    skeleton.style.height = `${CalculateSkeletonHight(mediaDimensions)}px`;
    return skeleton;
}

function CalculateSkeletonHight(mediaDimensions) {
    let containerWidth = document.querySelector(".content").getBoundingClientRect().width;
    return (containerWidth*mediaDimensions.height)/mediaDimensions.width;
}

function BuildContentColumns(num) {
    let columns = [];
    for(let i = 0; i < num; i++) {
        let column = BuildContentColumn();
        column.setAttribute("id",`content-col-${i}`)
        columns.push(column);
    }

    return columns;
}

function BuildContentColumn() {
    let column = document.createElement("div");
    column.classList.add("col-lg-4", "col-md-6", "col-sm-12", "content-col");
    let wrapper = document.createElement("div");
    wrapper.classList.add("content");
    column.appendChild(wrapper);
    return column;
}