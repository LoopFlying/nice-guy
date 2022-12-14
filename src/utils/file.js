const fs = require("fs");
const url = require("url");

/** 获取pathname */
const getPathName = (uri) => {
    return url.parse(uri).pathname || ''
}

const readFile = (path = './') => {
    const fileRes = fs.readFileSync(path, {encoding: 'utf-8'})
    if(!fileRes) return []
    return JSON.parse(fileRes)
}

module.exports  = {
    getPathName,
    readFile
}