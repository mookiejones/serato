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
        this.parse();
    }

    tryThis(){

        const binary = fs.readFileSync(this.filePath);

        const d = binary.length /8;
        for(let i=0;i<binary.length;i=i+8){

            const bufferBinary = Buffer.from(binary,i,1);
            const bufferLine = bufferBinary.toString('ascii')
debugger;        }


const items=        binary.some((value:number,index,array:Uint8Array)=>{
            debugger;
            return true;
        })



        for(let type of encodingOptions){

            const flag = Buffer.isEncoding(type);
            console.log(`type:${type},flag:${flag}`)


        }
        debugger;
        const binaryString = binary.toString('ascii');

        

        const split = binaryString.split(OTRK);

        debugger;

    }

    parse() {

        this.tryThis();


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