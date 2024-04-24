import express from 'express'

import torrentAPI from './Torrent.js'

const app = express()
const port = 1111

const torrents = await torrentAPI.search("Matrix", "All", 1200)

console.log(await torrentAPI.getMagnet(torrents[0])) 

app.listen(port)