import Config from '../../src/util/Config';
import {describe, expect, test} from '@jest/globals';
import fs from 'fs';
import path from 'path';
import chokidar from 'chokidar';
import {config} from 'dotenv';


config();
const SERATO_PATH: string = process.env.SERATO_PATH || "";
const PATH = path.join(SERATO_PATH, "Subcrates");

describe("getConfig",()=>{
    test('testing',()=>{

        

        expect(1).toBe(1);

    });
})