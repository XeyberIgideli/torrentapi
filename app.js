import express from 'express'

import torrentAPI from './Torrent.js'

const app = express()
const port = 1111

const torrent = await torrentAPI.search("Matrix", "All", 1200)

console.log(torrent)

app.listen(port)