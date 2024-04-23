import cloudscraper from 'cloudscraper'
import Cheerio from 'cheerio'

class torrentAPI {
    constructor () {
        this.categories = {
            All: "all:/search/{query}/1/",
            Movies: "Movies"
        }
        this.defaultCategory = "All"
        this.baseUrl = "https://www.1377x.to"
        this.searchUrl = "/category-search/{query}/{category}/1/"
    }
    async search (query,category) {  
        // const url = `https://www.1377x.to/category-search/${encodeURIComponent(query)}/${category}/1/`;
        const url = this.getUrl(category,query) 
        try {
            const body = await cloudscraper.get(url) 
            let torrents = this._parseTorrents(body) 
            return torrents
        } catch(err) {
            console.log(err)
        }     
    
    }

    _parseTorrents (body) {
        try {
            const $ = Cheerio.load(body)
            const torrents = []
         
            $('.table-list tbody tr').each((index, element) => {
             const torrentLink = this.baseUrl +  $(element).find('.name a').next().attr('href');
             const size = $(element).find('.size').text().trim();
            //  let sizeInMB = parseFloat(size)
            //  if(size.includes('GB')) {
            //      sizeInMB *= 1024
            //  }
             
            torrents.push(torrentLink)
            
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
        if(!catName) {
            return this.categories[this.defaultCategory]
        }

        return this.categories[catName]
    }


}

const search = new torrentAPI()

export default search
