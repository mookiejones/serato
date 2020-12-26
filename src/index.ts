import fs from 'fs';
import path from 'path';
import { CRATES_FOLDER } from './util';
import Crate from './Crate';
import chokidar from 'chokidar';

require('dotenv').config()


const SERATO_PATH: string = process.env.SERATO_PATH || "";
const PATH = path.join(SERATO_PATH, "Subcrates");
debugger;

// Initialize watcher.
const watcher = chokidar.watch(SERATO_PATH, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true
});


// https://github.com/paulmillr/chokidar
// Something to use when events are received.
const log = console.log.bind(console);
// Add event listeners.
watcher
    .on('add', path => log(`File ${path} has been added`))
    .on('change', path => log(`File ${path} has been changed`))
    .on('unlink', path => log(`File ${path} has been removed`))
    .on('addDir', path => log(`Directory ${path} has been added`))
    .on('unlinkDir', path => log(`Directory ${path} has been removed`))
    .on('error', error => log(`Watcher error: ${error}`))
    .on('ready', () => log('Initial scan complete. Ready for changes'))
    .on('raw', (event, path, details) => { // internal
        log('Raw event info:', event, path, details);
    });

// 'add', 'addDir' and 'change' events also receive stat() results as second
// argument when available: https://nodejs.org/api/fs.html#fs_class_fs_stats
watcher.on('change', (path, stats) => {
    if (stats) console.log(`File ${path} changed size to ${stats.size}`);
});

// // Full list of options. See below for descriptions.
// // Do not use this example!
// chokidar.watch('file', {
//     persistent: true,

//     ignored: '*.txt',
//     ignoreInitial: false,
//     followSymlinks: true,
//     cwd: '.',
//     disableGlobbing: false,

//     usePolling: false,
//     interval: 100,
//     binaryInterval: 300,
//     alwaysStat: false,
//     depth: 99,
//     awaitWriteFinish: {
//         stabilityThreshold: 2000,
//         pollInterval: 100
//     },

//     ignorePermissionErrors: false,
//     atomic: true // or a custom 'atomicity delay', in milliseconds (default 100)
// });




const listCratesSync = (subcratesFolder = CRATES_FOLDER): Crate[] => {
    const crates = fs.readdirSync(subcratesFolder).map(x => {
        const name = path.basename(x, ".crate");
        return new Crate(name, subcratesFolder);
    });
    return crates;
}


const crates = listCratesSync(PATH);

for (let crate of crates) {

    const songPaths = crate.getSongPathsSync();
    for (let songPath of songPaths) {
        console.log(songPath);

    }
}

