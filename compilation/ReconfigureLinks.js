#!/usr/bin/env node
const FILES_EXCLUDE = [
    "node_modules"
];
const ALLOWED_ENVIRONMENT_ARGS = [
    "prod",
    "dev"
];
const REGEX_DOUBLE_BACKSLASH = /(?<!\\)\\(?!\\)/g;
const REGEX_FILE_LINKS = /"[a-zA-Z\/\.\-\d_]+(\.js|\.css|\.ico|\.html|\.svg)"/g;
let LINKS_REPLACED = 0;

const filesystem = require("fs");
const yargs = require("yargs");
const path = require("path").win32;

const args = yargs
    .option('directory', {
        alias: 'd',
        demandOption: true,
        describe: 'directory to replace in'
    })
    .option('environment', {
        alias: 'e',
        demandOption: true,
        describe: 'environment to change to. options are\n\tprod: changes to /imgurviewer/ for production\n\tdev: changes to /js for local development'
    }).argv;

Main();

function Main() {
    ProcessArgs();
    const files = GetFilesRecursive(args.directory, IsFileHtmlOrJs);

    for(const file of files) {
        const data = filesystem.readFileSync(file, "utf8");
        const matches = [...data.matchAll(REGEX_FILE_LINKS)];
        const newData = ReplaceMatchesWithNewLink(data, matches);
        filesystem.writeFileSync(file, newData);
    }

    console.log(`operation successful\n${LINKS_REPLACED} links changed`);
}

function ProcessArgs() {
    if(!ALLOWED_ENVIRONMENT_ARGS.includes(args.environment)) {
        console.log(`${args.environment} is not a valid environment option`);
        process.exit();
    }

    args.directory = path.resolve(__dirname, args.directory);
    args.executingDirectory = __dirname.replace(new RegExp(REGEX_DOUBLE_BACKSLASH),"\\\\");
}

function GetFilesRecursive(path, filter) {
    let files = [];
    const items = filesystem.readdirSync(path, {withFileTypes:true});
    for(const item of items) {
        const itemPath = `${path}\\${item.name}`;
        if(itemPath.includes(args.executingDirectory) 
        || itemPath.includes("node_modules") 
        || item.name.includes("vendor"))
            continue;
        else if(item.isDirectory())
            files = [...files, ...GetFilesRecursive(itemPath, filter)];
        else if(filter(itemPath))
            files.push(itemPath);
    }
    return files;
}

function IsFileHtmlOrJs(filePath) {
    return !FILES_EXCLUDE.includes(filePath) && (filePath.endsWith(".html") || filePath.endsWith(".js"));
}

function ReplaceMatchesWithNewLink(data, matches) {
    for(const matchObj of matches) {
        const match = matchObj[0];
        switch(args.environment) {
            case "dev":
                if(match.startsWith("\"/imgurviewer")) {
                    const alteredString = match.replace("/imgurviewer","");
                    data = data.replace(match, alteredString);
                    LINKS_REPLACED++;
                }
                break;
            case "prod":
                if(!match.startsWith("\"/imgurviewer")) {
                    const alteredString = "\"/imgurviewer"+match.replace('"','');
                    data = data.replace(match, alteredString);
                    LINKS_REPLACED++;
                }
                break;
            default:
                console.log("unknown environment type");
                process.exit();
        }
    }

    return data;
}