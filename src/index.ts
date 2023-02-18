export { default as Song } from './Song';
export { default as Crate } from './Crate';
export { default as Database } from './Database';
export { listCrates, listCratesSync } from './listCrates';
export { default as getDefaultPath } from './util/getDefaultPath';


const isDebug = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

  
  if(isDebug){
    require('./Debug')();
  }