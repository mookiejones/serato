import path from 'path';
import os from 'os';

const INVALID_CHARACTERS_REGEX = /[^A-Za-z0-9_ ]/gi;

export const parse = (contents: string) => {
    // Find all 'ptrk' ocurrances
    const indices: number[] = [];


    for (let i = 0; i < contents.length; i++) {
        if (contents.slice(i, i + 4) === "ptrk") {
            indices.push(i);
        }
    }

    // Content in between these indices are the songs
    const songs: string[] = [];
    indices.forEach((value, index) => {
        const start = value + 9; // + 9 to skip the 'ptrk' itself and the bytes for size
        const isLast = index === indices.length - 1;
        const end = isLast ? contents.length : indices[index + 1] - 8; // -8 to remove 'otrk' and size bytes

        let filepath = contents.slice(start, end);
        filepath = filepath.replace(/\0/g, ""); // remove null-termination bytes
        songs.push(path.resolve("/", filepath));
    });
    return songs;
};

export const toSeratoString = (value: string) => "\0" + value.split("").join("\0");


export const intToHexbin = (value: number) => {
    const hex = value.toString(16).padStart(8, "0");
    let ret = "";
    for (let idx of [0, 2, 4, 6]) {
        let bytestr = hex.slice(idx, idx + 2);
        ret += String.fromCodePoint(parseInt(bytestr, 16));
    }
    return ret;
};

export const sanitizeFilename = (filename: string) => filename.replace(INVALID_CHARACTERS_REGEX, "-");

// Singleton for Serato Folder Path (I doubt it'll change during runtime)
const SERATO_FOLDER = path.join(os.homedir(), "Music", "_Serato_");
export const CRATES_FOLDER = path.join(SERATO_FOLDER, "SubCrates");
