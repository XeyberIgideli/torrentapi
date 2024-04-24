import cloudscraper from 'cloudscraper'
import Cheerio from 'cheerio'

class torrentAPI {
    constructor () {
        this.categories = {
            All: "all:/search/{query}/1/",
            Movies: "Movies",
            TV: "TV",
            Music: "Music",
            Games: "Games",
            Applications: "Applications",
            Documentaries: "Documentaries",
            Anime: "Anime",
            Other: "Other",
            XXX: "XXX"

        }
        this.defaultCategory = "All"
        this.baseUrl = "https://www.1377x.to"
        this.searchUrl = "/category-search/{query}/{category}/1/"
        this.size
    } 
    async search (query,category, size = this.size,sortBy = "seeds", sortOrder = "desc") {  
         
        const url = this.getUrl(category,query) 
        try {
            const body = await cloudscraper.get(url) 
            let torrents = this._parseTorrents(body,size, sortBy, sortOrder)

            if(sortBy) {
                torrents = this.sortBy(torrents, sortBy, sortOrder)
            } 

            if(size) {
               torrents = this.filterBySize(torrents,size)
            }

            return torrents
        } catch(err) {
            console.log(err)
        }     
    
    }

    _parseTorrents (body) {
        try {
            const $ = Cheerio.load(body)
            let torrents = [] 
            
            $('.table-list tbody tr').each((index, element) => {
             const title = $(element).find('.name a').text().trim();
             const torrentLink = this.baseUrl +  $(element).find('.name a').next().attr('href');
             // Sorts 
             const size = $(element).find('.size').text().trim();
             const seeds = parseInt($(element).find('.seeds').text().trim());
             const leeches = parseInt($(element).find('.leeches').text().trim());
             const time = $(element).find('.coll-date').text().trim();

             let sizeInMB = parseFloat(size)

             if(size.includes('GB')) {
                 sizeInMB *= 1024
             }
             
             torrents.push({
                torrentLink,
                title,
                seeds,
                size:sizeInMB,
                leeches,
                time
                })

             }) 

                return torrents

            } catch(err) {
                console.log(err)
            }
    }

    getUrl (category,query) { 
         let cat = this.getValueOfCategories(category) 
         let url = this.baseUrl + (cat.startsWith("all:") ? cat.substr(4) : this.searchUrl)

         url = url.replace("{query}", query).replace("{category}", category)
         return url
    }

    getValueOfCategories (catName) {
        if(!catName || !this.categories[catName]) { 
            this.size = catName
            return this.categories[this.defaultCategory]
        }
    
        return this.categories[catName]
    }

    sortBy (torrents, field, order) {
        return torrents.sort((a, b) => (order === 'desc' ? b[field] - a[field] : a[field] - b[field]));

    }

    filterBySize (torrents,threshold) {
        return torrents.filter((item) => item.size <= threshold)
    }

    async getTorrentDetails (torrent) {
        try {
            const body = await cloudscraper.get(torrent) 
            return body
        } catch (err) {
            console.log(err)
        }
    }

    async getMagnet (torrent) {
        try {
            const body = await this.getTorrentDetails(torrent.torrentLink)
            const $ =  Cheerio.load(body)

            const magnet = $('a.torrentdown1').attr('href')
            return magnet
        } catch(err) {
            console.log(err)
        }
    }

}

const search = new torrentAPI()

export default search
