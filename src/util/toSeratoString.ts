

const toSeratoString = function (string: any) {
    return "\0" + string.split("").join("\0");
};

export default toSeratoString;