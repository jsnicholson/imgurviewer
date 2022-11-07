import {ImgurRepository} from "/js/ImgurRepository.js";
import {MediaHandler} from "/js/MediaHandler.js";
import {Gallery} from "/js/Gallery.js";
import {Options} from "/js/Options.js";
import {TagStorage} from "/js/TagStorage.js";

const typeMap = new Map([
  ["ImgurRepository", new ImgurRepository()],
  ["MediaHandler", new MediaHandler()],
  ["Gallery", new Gallery()],
  ["Options", new Options()],
  ["TagStorage", new TagStorage()]
]);

export function Resolve(type) {
  let obj = typeMap.get(type);
  if(obj == null) {
    console.error(`TypeException: Unable to resolve type "${type}"`);
    return null;
  }
  return typeMap.get(type);
}