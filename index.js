// const torrentSource = require('./torrentSource')  
// const initApi = require('./initApi')
// const path = require('path')
import path from 'path'
import url from 'url' 
import initApi from './initApi.js'

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 
const inittedTorrent = initApi(path.join(__dirname,'./sources')) 
const got = await inittedTorrent.setSource("1377x")  
const torrents = await got.search({query:"Matrix", category: "Movies", limit: 1}) 
// console.log(await got.getMagnet(torrents[0])) 
// console.log(await got.getTorrent(torrents[0], 'sources')) 
