const INVALID_CHARACTERS_REGEX = /[^A-Za-z0-9_ ]/gi;



const sanitizeFilename = function (filename: any) {
    return filename.replace(INVALID_CHARACTERS_REGEX, "-");
};

export default sanitizeFilename;