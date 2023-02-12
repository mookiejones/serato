
const getIndices = (contents: string, search: string) => {
    const indices: any = [];

    for (let i = 0; i < contents.length; i++) {
        if (contents.slice(i, i + 4) === search) {
            indices.push(i);
        }
    }
    return indices;

}



export default getIndices;