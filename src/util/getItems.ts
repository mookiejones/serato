import * as fs from 'fs';
import getIndices from "./getIndices";
import Keys from './Keys';
const getItems = (filePath:string)=>{
    
    const contents = fs.readFileSync(filePath,'ascii');

    const indices = getIndices(contents,Keys.OTRK);

    const result:any[] = [];

    indices.forEach((value: any, index: number) => {
        const start = value + 8; // + 9 to skip the 'ptrk' itself and the bytes for size
        const isLast = index === indices.length - 1;
        const end = isLast ? contents.length : indices[index + 1] - 8; // -8 to remove 'otrk' and size bytes
        const item = contents.slice(start, end);
        result.push(item);
    });

    return result;
};

export default getItems;