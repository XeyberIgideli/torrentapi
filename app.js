import express from 'express'

import torrentAPI from './Torrent.js'

const app = express()
const port = 1111

const torrent = await torrentAPI.search("Matrix", "All")
// const torrent = torrentAPI.getUrl("All", "Matrix")

console.log(torrent)

app.listen(port)