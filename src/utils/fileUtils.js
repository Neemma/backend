const fs = require('fs');

const readFile = (path) => {
    return JSON.parse(fs.readFileSync(path));
};

const writeFile = (path, data) => {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
};

module.exports = {
    readFile,
    writeFile
};
