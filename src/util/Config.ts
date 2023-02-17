import fs from 'fs';
import path from 'path';
import {config} from 'dotenv';

config();
const SERATO_PATH: string = process.env.SERATO_PATH || "";
const PATH = path.join(SERATO_PATH, "Subcrates");

interface ConfigType {
    serato_path:string,
    path:string    
}

class Config implements ConfigType{
    serato_path: string;
    path: string;

    constructor(serato_path:string = SERATO_PATH, path:string = PATH){
        this.serato_path=serato_path;
        this.path=path;
    }
}

export default Config;

