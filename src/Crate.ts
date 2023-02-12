import * as fs from 'fs';
import util from 'util';
import os from 'os';
import path from 'path';
import { OTRK } from './util/Keys'
import Song from './Song';
import BaseFile from './BaseFile';
import {
    parse,

    toSeratoString,
    intToHexbin,
    sanitizeFilename
} from './util'
import  getIndices  from './util/getIndices';
const SERATO_FOLDER = path.join(os.homedir(), "Music", "_Serato_");
const CRATES_FOLDER = path.join(SERATO_FOLDER, "SubCrates");
class Crate extends BaseFile {
    name: string = ""
    filepath: string;
    songPaths?: string[] | null = [];


    constructor(name: any, subcratesFolder: any = CRATES_FOLDER) {
        super();
        // TODO: Make private
        this.name = sanitizeFilename(name);
        this.filepath = path.join(subcratesFolder, this.name + ".crate");
        this.songPaths = null; // singleton to be lazy-populated
    }
    getSongs(): Song[] {
        const contents = fs.readFileSync(this.filepath, 'ascii');
        const indices = getIndices(contents, OTRK);
        indices.forEach((value: any, index: number) => {
            const start = value + 8; // + 9 to skip the 'ptrk' itself and the bytes for size
            const isLast = index === indices.length - 1;
            const end = isLast ? contents.length : indices[index + 1] - 8; // -8 to remove 'otrk' and size bytes
            const item = contents.slice(start, end);
            let song = Song.create(item);
            this.songs.push(song);
        });
        return this.songs;
    }
    async getSongsSync() {
        if (this.songs === null) {
            const contents = await util.promisify(fs.readFile)(
                this.filepath,
                "ascii"
            );
            debugger;
            console.log(contents);
        }
        debugger;
    }
    async getSongPaths() {
        if (this.songPaths === null) {
            const contents = await util.promisify(fs.readFile)(
                this.filepath,
                "ascii"
            );
            this.songPaths = parse(contents);
        }
        return Promise.resolve(this.songPaths);
    }

    getSongPathsSync() {
        if (this.songPaths === null) {
            const contents = fs.readFileSync(
                this.filepath,
                "ascii"
            );

            this.songPaths = parse(contents);
        }
        return this.songPaths;
    }

    addSong(songPath:string) {
        if (this.songPaths === null) {
            this.songPaths = [];
        }

        const resolved = path.resolve(songPath);
        this.songPaths?.push(resolved);
    }
    _buildSaveBuffer() {
        const header = "vrsn   8 1 . 0 / S e r a t o   S c r a t c h L i v e   C r a t e".replace(
            / /g,
            "\0"
        );

        let playlistSection = "";
        if (this.songPaths) {
            this.songPaths.forEach(value => {
                const data = toSeratoString(path.relative("/", value));
                let ptrkSize = intToHexbin(data.length);
                let otrkSize = intToHexbin(data.length + 8); // fixing the +8 (4 for 'ptrk', 4 for ptrkSize)
                playlistSection += "otrk" + otrkSize + "ptrk" + ptrkSize + data;
            });
        }

        const contents = header + playlistSection;
        return Buffer.from(contents, "ascii");
    }

    async save() {
        const buffer = this._buildSaveBuffer();
        return util.promisify(fs.writeFile)(this.filepath, buffer, {
            encoding: null
        });
    }
    saveSync() {
        const buffer = this._buildSaveBuffer();
        fs.writeFileSync(this.filepath, buffer, { encoding: null });
    }
}

export default Crate;
