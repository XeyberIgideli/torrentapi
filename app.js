import express from 'express'

import torrentAPI from './Torrent.js'

const app = express()
const port = 1111

const torrents = await torrentAPI.search({query:"Matrix", })
// console.log(torrents)
// console.log(torrentAPI.pageCount(30, 20))
// console.log(await torrentAPI.getMagnet(torrents[0])) 

app.listen(port)