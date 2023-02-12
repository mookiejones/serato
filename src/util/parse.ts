import getIndices from './getIndices';
import { PTRK } from './Keys';
import path from 'path';

const parse = function (contents: string) {
    // Find all 'ptrk' ocurrances
    const indices = getIndices(contents, PTRK);



    // Content in between these indices are the songs
    const songs: any = [];
    indices.forEach((value: any, index: number) => {
        const start = value + 9; // + 9 to skip the 'ptrk' itself and the bytes for size
        const isLast = index === indices.length - 1;
        const end = isLast ? contents.length : indices[index + 1] - 8; // -8 to remove 'otrk' and size bytes

        let filepath = contents.slice(start, end);
        filepath = filepath.replace(/\0/g, ""); // remove null-termination bytes
        songs.push(path.resolve("/", filepath));
    });
    return songs;
};
export default parse;