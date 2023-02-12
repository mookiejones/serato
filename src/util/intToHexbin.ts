

const intToHexbin = function (number: any) {
    const hex = number.toString(16).padStart(8, "0");
    let ret = "";
    for (let idx of [0, 2, 4, 6]) {
        let bytestr = hex.slice(idx, idx + 2);
        ret += String.fromCodePoint(parseInt(bytestr, 16));
    }
    return ret;
};

export default intToHexbin;