
import fs from 'fs';
import path from 'path';
import Crate from './Crate';
import util from 'util';


function listCratesSync(subcratesFolder: string) {
    const crates = fs.readdirSync(subcratesFolder).map(x => {
        const name = path.basename(x, ".crate");
        return new Crate(name, subcratesFolder);
    });
    return crates;
}

async function listCrates(subcratesFolder: any) {
    const files = await util.promisify(fs.readdir)(subcratesFolder);
    const crates = files.map(x => {
        const name = path.basename(x, ".crate");
        return new Crate(name, subcratesFolder);
    });
    return crates;
}

export { listCrates, listCratesSync };