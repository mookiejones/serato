import * as fs from 'fs';

import  getIndices from './util/getIndices';
import Song from './Song';
import { OTRK } from './util/Keys';

const encodingOptions = [
    'ascii',
    'base64',
    'base64url',
    'binary',
    'hex',
    'latin1',
    'ucs-2',
    'utf-8',
    'utf16le',
    'utf8'
]
class Database {
    songs: Song[] = [];
    filePath: string;

    static getDatabase = (filePath: string): Database => new Database(filePath);

    private constructor(filePath: string) {       
        this.filePath = filePath;
        this.parseFile();
    }

    private parseFile(){
        let contents = fs.readFileSync(this.filePath,'ascii');


        let lines = contents.split('otrk')
            .filter((value:string,index:number,array:string[])=>index!=0)
            .map((value:string,index:number,array:string[])=>new Song(value,index,array));

            this.songs = lines;


    }
     
    parse() {

        this.parseFile();
        return;


        const contents = fs.readFileSync(this.filePath, "ascii")
        const indices = getIndices(contents, OTRK);

        indices.forEach((value: any, index: number) => {
            const start = value + 8; // + 9 to skip the 'ptrk' itself and the bytes for size
            const isLast = index === indices.length - 1;
            const end = isLast ? contents.length : indices[index + 1] - 8; // -8 to remove 'otrk' and size bytes
            const item = contents.slice(start, end);
            let song = Song.create(item);;
            this.songs.push(song);
        });
//        console.log(`there are ${this.songs.length} songs in ${this.filePath}`);
    }




}

export default Database;