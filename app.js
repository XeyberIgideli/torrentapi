import express from 'express'
import cloudscraper from 'cloudscraper'
import Cheerio from 'cheerio'

const app = express()
const port = 1111
const searchQuery = "Matrix"
const searchUrl = `https://www.1377x.to/search/${encodeURIComponent(searchQuery)}/1/`;

app.get('/search', (req,res) => {
    cloudscraper.get(searchUrl, (error,response,body) => {
        console.log(body)
    })
})

app.listen(port)