export {
    CLIENT_ID,
    ENDPOINT_AUTHORISE,
    ENDPOINT_ACCESS_TOKEN,
    ENDPOINT_ACCOUNT_IMAGE_COUNT,
    ENDPOINT_ACCOUNT_IMAGES,
    ENDPOINT_ALBUM_IMAGES,
    PAGE_SIZE,
    IMAGES_TO_LOAD_EACH_TIME,
    BREAKPOINT_SM,
    BREAKPOINT_MD,
    BREAKPOINT_LG,
    TEXT_SIGNED_IN_AS,
    TEXT_NOT_SIGNED_IN,
    TEXT_LOAD_ACCOUNT_IMAGES,
    TEXT_LOAD_ACCOUNT_IMAGES_AGAIN,
    TEXT_LOAD_ALBUM_IMAGES,
    TEXT_LOAD_ALBUM_IMAGES_AGAIN,
    TEXT_LOG_OUT,
    TEXT_AUTHORISE,
    TEXTMAP_ACTION_LOAD_ACCOUNT_IMAGES,
    TEXTMAP_ACTION_LOAD_ALBUM_IMAGES,
    ERROR_FETCH_ABORTED,
    ERRORMAP_TYPE_TO_CLASS
};

const ENDPOINT_AUTHORISE="https://api.imgur.com/oauth2/authorize?client_id={{clientId}}&response_type=token";
const ENDPOINT_ACCESS_TOKEN="https://api.imgur.com/oauth2/token";
const ENDPOINT_ACCOUNT_IMAGE_COUNT="https://api.imgur.com/3/account/me/images/count";
const ENDPOINT_ACCOUNT_IMAGES="https://api.imgur.com/3/account/me/images/{{page}}";
const ENDPOINT_ALBUM_IMAGES="https://api.imgur.com/3/album/{{albumHash}}/images";
const CLIENT_ID="058c8bb3e94cc6d";
const PAGE_SIZE=50;
const IMAGES_TO_LOAD_EACH_TIME=20;
const BREAKPOINT_SM=576;
const BREAKPOINT_MD=768;
const BREAKPOINT_LG=992;

// TEXT
const TEXT_SIGNED_IN_AS="Signed in as: {username}"
const TEXT_NOT_SIGNED_IN="Not signed in"
const TEXT_LOAD_ACCOUNT_IMAGES="Load account images"
const TEXT_LOAD_ACCOUNT_IMAGES_AGAIN="Load account images again"
const TEXT_LOAD_ALBUM_IMAGES="Load album images"
const TEXT_LOAD_ALBUM_IMAGES_AGAIN="Load album images again"
const TEXT_LOG_OUT="Log out"
const TEXT_AUTHORISE="Authorise"

// TEXT MAPS
const TEXTMAP_ACTION_LOAD_ACCOUNT_IMAGES = new Map([
    ["#buttonLoadAccountImages", TEXT_LOAD_ACCOUNT_IMAGES_AGAIN]
]);
const TEXTMAP_ACTION_LOAD_ALBUM_IMAGES = new Map([
    ["#buttonLoadAlbumImages", TEXT_LOAD_ALBUM_IMAGES_AGAIN]
]);

// ERROR MESSAGES
const ERROR_FETCH_ABORTED = "Already running fetches were aborted";

const ERRORMAP_TYPE_TO_CLASS = new Map([
   ["danger","alert-danger"],
   ["success","alert-success"],
   ["info","alert-light"] 
]);