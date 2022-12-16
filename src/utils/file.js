const fs = require("fs");
const url = require("url");

/** 获取pathname */
const getPathName = (uri) => {
    const pathName = url.parse(uri).pathname
    return pathName === '/' ? url.parse(uri).hostname : pathName
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