

import { labels,Fields } from './util/Keys'
import _ from 'lodash'

class Song {




    //PUBLIC PROPERTIES
    /// <summary>
    /// The title of the song
    /// </summary>
    Title: string = "";


    /// <summary>
    /// The artist who performs the song
    /// </summary>
    Artist: string = "";


    /// <summary>
    /// The album the song appears on
    /// </summary>
    Album: string = "";

    /// <summary>
    /// The genre of the song
    /// </summary>
    Genre: string = "";

    /// <summary>
    /// The length of the song
    /// </summary>
    Length: string = "";

    /// <summary>
    /// The size of the song
    /// </summary>
    Size: string = "";

    /// <summary>
    /// The file type of the song
    /// </summary>
    Type: string = "";

    /// <summary>
    /// The string representation of the path to the song
    /// </summary>
    PathString: string = "";

    /// <summary>
    /// The bitrate of the song
    /// </summary>
    Bitrate: string = "";

    /// <summary>
    /// The sample rate of the song
    /// </summary>
    SampleRate: string = "";

    /// <summary>
    /// The beats per minute of the song
    /// </summary>
    Bpm: string = "";

    /// <summary>
    /// The contents of the comment field
    /// </summary>
    Comment: string = "";

    /// <summary>
    /// The contents of the group field
    /// </summary>
    Group: string = "";

    /// <summary>
    /// The composer of the song
    /// </summary>
    Composer: string = "";

    /// <summary>
    /// The year that the song was released
    /// </summary>
    Year: string = "";

    /// <summary>
    /// The key the song is in
    /// </summary>
    Key: string = "";

    /// <summary>
    /// Whether or not the song has been marked as missing
    /// </summary>
    IsMissing: boolean=true;


    /// <summary>
    /// Whether or not the song has been marked as played
    /// </summary>
    IsPlayed: boolean = false;




    static create(dbString: string): Song {


        let toRet = new Song(dbString,-1,[]);

        for (let farthestReached = 0; farthestReached < dbString.length;) {
            let startOfString = -1;
            let endOfString = -1;

            //Gets the start index
            for (let l of labels) {
                startOfString = dbString.indexOf(l, farthestReached);

                if (startOfString >= 0) {
                    farthestReached = startOfString + l.length;
                    break;
                }
            }

            //If a field was not found, there are no more fields
            if (startOfString == -1)
                break;

            //Gets the end index
            for (let l of labels) {

                // Find the minimum
                let closest = labels
                    .filter(label => label !== l)
                    .map(label => dbString.indexOf(label, farthestReached))
                    .filter(o => o > -1)
                    .sort();


                closest.sort();
                endOfString = closest.length > 0
                    ? Math.min(...closest)
                    : dbString.indexOf(l, farthestReached);

                if (startOfString >= 0)
                    break;
            }

            //If no next field was found, this is the last field
            if (endOfString == -1)
                endOfString = dbString.length;

            //Updates the farthest reached
            farthestReached = endOfString;

            //Isolates the chunk of string to process and cuts out the field and value
            let fieldValueString = dbString.substring(startOfString, endOfString);
            let fieldLabel = fieldValueString.substring(0, 4);
            let rawString = fieldValueString.substring(fieldLabel.length);

            //Performs different actions based off the type of field
            switch (fieldLabel[0]) {
                case 'p':
                case 't':
                    let stringValue = "";
                    // Get Index of first non binary letter
                    for (let i = 0; i < rawString.length; i++) {
                        let code = rawString.charCodeAt(i);
                        if (code <= 33) {
                            continue;
                        }
                        stringValue = rawString.substr(i);
                        break;
                    }


                    toRet = Song.assignStringField(toRet, fieldLabel, stringValue);
                    break;
            }
        }




        return toRet;
    }

    
    findSong(o:string,value:string){
        return {
            key:o,
            position:value.indexOf(o)
        }
    }
    constructor(value:string,index:number,arr:string[]){

 
        const fields=Object.values(Fields)
        .map(o=>this.findSong(o,value))
        .filter(i=>i.position !=-1)
        
        const fieldsIndex = _.sortBy(fields,'position')
       
        for(let idx in fieldsIndex){

            const i = parseInt(idx);

            const {key,position} = fieldsIndex[i];

            // does next index exist?
            let exists = i<fieldsIndex.length-1;

            try 
            {
            const rawValue = exists
                                ? value.substring(position+key.length,fieldsIndex[i+1].position)
                                :value.substring(position+key.length);



            Song.assignStringField(this,key,rawValue);
            }catch(e:any){
                debugger;
            }
        }

        
    }

    private static assignStringField(song: Song, field: string, value: string): Song {
        switch (field) {
            case Fields.TYPE_FIELD:
                song.Type = value;
                break;
            case Fields.PATH_FIELD:
                song.PathString = value;
                break;
            case Fields.SONG_FIELD:
                song.Title = value;
                break;
            case Fields.ARTIST_FIELD:
                song.Artist = value;
                break;
            case Fields.ALBUM_FIELD:
                song.Album = value;
                break;
            case Fields.GENRE_FIELD:
                song.Genre = value;
                break;
            case Fields.LENGTH_FIELD:
                song.Length = value;
                break;
            case Fields.SIZE_FIELD:
                song.Size = value;
                break;
            case Fields.BITRATE_FIELD:
                song.Bitrate = value;
                break;
            case Fields.SAMPLE_RATE_FIELD:
                song.SampleRate = value;
                break;
            case Fields.BPM_FIELD:
                song.Bpm = value;
                break;
            case Fields.COMMENT_FIELD:
                song.Comment = value;
                break;
            case Fields.GROUP_FIELD:
                song.Group = value;
                break;
            case Fields.LABEL_FIELD:
                break;
            case Fields.COMPOSER_FIELD:
                song.Composer = value;
                break;
            case Fields.YEAR_FIELD:
                song.Year = value;
                break;
            case Fields.DATE_ADDED_FIELD:
                break;
            case Fields.KEY_FIELD:
                song.Key = value;
                break;
                case 'blop':
case 'bitu':
case 'bovc':
case 'bcrt':
case 'biro':
case 'bwlb':
case 'bwll':
case 'buns':
case 'bbgl':
case 'bkrk':
    case'bply':

            case 'bmis':
                case 'uadd':
                    case 'ulbl':
                break; 
                default:
                    debugger;
                    break;
        }
        return song;
    }



}

export default Song;