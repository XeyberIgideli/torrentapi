// const torrentSource = require('./torrentSource')  
// const initApi = require('./initApi')
// const path = require('path')
import path from 'path'
import url from 'url'
import torrentSource from './torrentSource.js'
import initApi from './initApi.js'

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 
const inittedTorrent = initApi(path.join(__dirname,'./sources'))
const got = await inittedTorrent.setSource("1377x") 
// const test = new torrentSource()  
// console.log(test.loadSource("sources")) 
// console.log(test.loadSources("sources"))
// const torrents = await got.search({query:"Matrix", category: "Movies", limit: 3}) 
// console.log(await got.getMagnet(torrents[0])) 
