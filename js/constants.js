export {
    CLIENT_ID,
    ENDPOINT_AUTHORISE,
    ENDPOINT_ACCESS_TOKEN,
    ENDPOINT_ACCOUNT_IMAGE_COUNT,
    ENDPOINT_ACCOUNT_IMAGES,
    PAGE_SIZE,
    IMAGES_TO_LOAD_EACH_TIME,
    MEDIA_QUERY_SM
};

const ENDPOINT_AUTHORISE="https://api.imgur.com/oauth2/authorize?client_id={{clientId}}&response_type=token";
const ENDPOINT_ACCESS_TOKEN="https://api.imgur.com/oauth2/token";
const ENDPOINT_ACCOUNT_IMAGE_COUNT="https://api.imgur.com/3/account/me/images/count";
const ENDPOINT_ACCOUNT_IMAGES="https://api.imgur.com/3/account/me/images/{{page}}";
const CLIENT_ID="058c8bb3e94cc6d";
const PAGE_SIZE=50;
const IMAGES_TO_LOAD_EACH_TIME=20;
const MEDIA_QUERY_SM=window.matchMedia("(max-width:576px)");