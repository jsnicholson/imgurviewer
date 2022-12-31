export {
    FileMediaList,
    MediaInfo
}

class FileMediaList {
    jsonData = {
        availableTags:[],
        media:[
            /* 
            "8nsiie32":{
                "date":"02242022"
                "tags":[
                    "art",
                    "painting",
                    "landscape"
                ]
            }
            */
        ]
    };

    LoadFile(filePath){
        var reader = new FileReader();
        reader.readAsText(filePath, "UTF-8");
        reader.onload = function (event) {
            jsonData = JSON.parse(event.target.result);
            console.log(`file ${filePath.name} successfully loaded`);
        }
    }

    SaveFile(){}
    GetMedia(id){
        let media = this.jsonData.media[id];
        return MediaInfo(media.id, media.date, media.tags);
    }

    SetMedia(mediaInfo){
        if(!(auto instanceof MediaInfo))
            throw "Incorrect type! Expected type of 'mediaInfo' is 'MediaInfo'";

        this.jsonData.media[mediaInfo.id] = {
            date: mediaInfo.date,
            tags: mediaInfo.tags
        };
    }
}

class MediaInfo {
    id = null;
    date = null;
    tags = [];

    constructor(id, date, tags) {
        this.id = id;
        this.date = date;
        this.tags = tags;
    }
}