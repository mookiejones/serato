const fs = require("fs");
const util = require("util");
const os = require("os");
const path = require("path");

const ASCII_KEY = 'ascii'
import {
    parse,
    toSeratoString,
    intToHexbin,
    sanitizeFilename,
    CRATES_FOLDER
} from './util';



export default class Crate {

    name: string;
    filepath: string;
    songPaths: string[] | null;

    constructor(name: string, subcratesFolder = CRATES_FOLDER) {
        // TODO: Make private
        this.name = sanitizeFilename(name);
        this.filepath = path.join(subcratesFolder, this.name + ".crate");
        this.songPaths = null; // singleton to be lazy-populated
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
            this.songPaths = parse(fs.readFileSync(this.filepath, ASCII_KEY));
        }
        return this.songPaths;
    }

    addSong(songPath: string) {
        if (this.songPaths === null) {
            this.songPaths = [];
        }

        const resolved = path.resolve(songPath);
        this.songPaths.push(resolved);
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