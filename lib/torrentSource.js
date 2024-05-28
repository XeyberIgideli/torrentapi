import Cheerio from "cheerio"
import cloudscraper from "cloudscraper"
import {MagnetToTorrent, toMagnetURI} from "../utils/Helper.js"
class torrentSource {
  constructor(source) {
    this.#startSource(source)
    this.torrents = []
 
  }
  #startSource(source) {  
    const defaultSource = {
      categories: {
        All: "",
        Movies: "",
        TV: "",
        Music: "",
        Games: "",
        Applications: "",
        Documentaries: "",
        Anime: "",
        Other: "", 
        XXX: "",
      },
      defaultCategory: "",
      baseUrl: "",
      searchUrl: "",
      size: 1200,
      resultsPerPage: 20,
    } 
    Object.assign(this,defaultSource, source)    
  } 
  async search(args) { 
    
    let { query, category, size, limit, sortBy, sortOrder } = args 

    if (!query) {
      throw new Error("No query provided");
    }

    if (!limit) {
      limit = this.resultsPerPage;
    }

    if(this.api) {
        return this.#apiCrawler(category, query, limit)
    }
    
    const totalPage = Math.ceil(limit / this.resultsPerPage)

    try {
      
      let newbody;
      for (let i = 1; i <= totalPage; i++) {
        newbody += await cloudscraper.get(this.#getUrl(category, query, i))
      }
      let torrents = this.#limitResults(
        await this.#_parseTorrents(newbody, size, sortBy, sortOrder),
        limit
      );
      if (sortBy) {
        torrents = this.#sortBy(torrents, sortBy, sortOrder);
      }

      if (size) {
        torrents = this.#filterBySize(torrents, size);
      }
      return torrents;
    } catch (err) {
      console.log(err);
    }
  }

  async #_parseTorrents(body) {
    try {
      const $ = Cheerio.load(body);
      let torrents = []; 
      $(".table-list tbody tr").each((index, element) => {
        const title = $(element).find(this.itemsSelector.title).text().trim();
        const torrentLink = this.baseUrl + $(element).find(this.itemsSelector.title).next().attr("href");
        // Sorts
        const size = $(element).find(this.itemsSelector.size).text().trim();
        const seeds = parseInt($(element).find(this.itemsSelector.seeds).text().trim());
        const leeches = parseInt($(element).find(this.itemsSelector.leeches).text().trim());
        const time = $(element).find(this.itemsSelector.time).text().trim();
        let sizeInMB = parseFloat(size);

        if (size.includes("GB")) {
          sizeInMB *= 1024;
        }

        torrents.push({
          torrentLink,
          title,
          seeds,
          size: sizeInMB,
          leeches,
          time,
          
        });
      });

      return torrents;
    } catch (err) {
      console.log(err);
    }
  }

  #getUrl(category, query, limitPage) {
    let cat = this.#getValueOfCategories(category);
    let url =
      this.baseUrl + (cat.startsWith("all:") ? cat.substr(4) : this.searchUrl);

    url = url
      .replace("{query}", query)
      .replace("{category}", category)
      .replace("{limit}", limitPage);
    return url;
  }

 #getValueOfCategories(catName) {
    if (!catName || !this.categories[catName]) {
      this.size = catName;

      return this.categories[this.defaultCategory];
    }
    return this.categories[catName];
  }

  #sortBy(torrents, field, order) {
    return torrents.sort((a, b) =>
      order === "desc" ? b[field] - a[field] : a[field] - b[field]
    );
  }

  #filterBySize(torrents, threshold) {
    return torrents.filter((item) => item.size <= threshold);
  }

  async getTorrentDetails(torrent) {
    try {
      const body = await cloudscraper.get(torrent)
      const $ = Cheerio.load(body)
      const infoHash = $(this.torrentDetailsSelector.infoHash).text().trim()
      const magnet = $(this.torrentDetailsSelector.magnet).attr("href")
      return {infoHash, magnet}
    } catch (err) {
      console.log(err);
    }
  }

  async getMagnet(torr) {
    try {  
      if(this.api) {
        const magnets = await Promise.all(this.torrents.map(torrent => {
          return toMagnetURI(torrent.url, torrent.hash, torr.title_long)
        }))
        return magnets
      }

      const magnet = (await this.getTorrentDetails(torr.torrentLink)).magnet
     
      return magnet
    } catch (err) {
      console.log(err) 
    }
  }

  async getTorrent (torrent, path) {
    if(this.api) {
      return this.torrents
    }
    this.torrents = []
    const magnetUri = await this.getMagnet(torrent)
    return MagnetToTorrent(magnetUri, path)
  }

  async #apiCrawler (category, query, limit) {
    const url = this.#getUrl(category, query, limit)
    const response = await fetch(url, {method: "GET"})
    const data = (await response.json()).data
    const torrents = data.movies[0].torrents
    this.torrents = torrents
    
    return data.movies
  }

  #limitResults(torrents, limit) {
    return torrents.slice(0, limit)
  }
}

export default torrentSource
