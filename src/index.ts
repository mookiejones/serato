import {writeFileSync,readdirSync} from 'fs';
import path from 'path';
import { CRATES_FOLDER } from './util';
import Crate from './Crate';
import chokidar from 'chokidar';

import { config } from 'dotenv';
import Config from './util/Config';
import Database from './Database';

export { default as Crate } from './Crate';
export { default as Database } from './Database';


export { listCrates, listCratesSync } from './listCrates';

export { default as getDefaultPath } from './util/getDefaultPath';


const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

  
  if(isDebug){
    config();


const seratoConfig = new Config();




 
const db = Database.getDatabase(seratoConfig.serato_path);

const savePath=path.join(__dirname,'json.json');
const json = JSON.stringify(db);
debugger;
writeFileSync(savePath,json);

console.log(`saved file to ${savePath}`)
debugger;



// Initialize watcher.
const watcher = chokidar.watch(seratoConfig.serato_path, {
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


const listDatabaseSync = (directory:string = seratoConfig.serato_path)=>{
    const db = Database.getDatabase(directory);
    return db;
}

const seratoDatabase = listDatabaseSync(seratoConfig.serato_path)

const listCratesSync = (subcratesFolder = CRATES_FOLDER): Crate[] => {
    const crates = readdirSync(subcratesFolder).map(x => {
        const name = path.basename(x, ".crate");
        return new Crate(name, subcratesFolder);
    });
    return crates;
}

 

  }