// import path from 'path'
// import {readdirSync} from 'fs'
const path = require('path')
const {readdirSync} = require('fs')
// import { load } from 'cheerio';
const cloudscraper = require('cloudscraper')
const Cheerio = require('cheerio') 
class torrentSource { 
  constructor(source) { 
    this.startSource(source); 
  }
  startSource(source) {
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
    Object.assign(this, source)   
    // console.log(this)
  } 
  async search(args) {
    let { query, category, size, limit, sortBy, sortOrder } = args; 
    if (!query) {
      throw new Error("No query provided");
    }

    if (!limit) {
      limit = this.resultsPerPage;
    } 
    const totalPage = Math.ceil(limit / this.resultsPerPage);

    try {
      let newbody;
      for (let i = 1; i <= totalPage; i++) {
        newbody += await cloudscraper.get(this.getUrl(category, query, i));
      }   
      // console.log(await this._parseTorrents(newbody, size, sortBy, sortOrder))
      let torrents = this.limitResults(
        await this._parseTorrents(newbody, size, sortBy, sortOrder),
        limit
      );
      if (sortBy) {
        torrents = this.sortBy(torrents, sortBy, sortOrder);
      }

      if (size) {
        torrents = this.filterBySize(torrents, size);
      }
      console.log(torrents)
      return torrents;
    } catch (err) {
      console.log(err);
    }
  }

  async _parseTorrents(body) {
    try {
      const $ = Cheerio.load(body);
      let torrents = [];

      $(".table-list tbody tr").each((index, element) => {
        const title = $(element).find(".name a").text().trim();
        const torrentLink =
          this.baseUrl + $(element).find(".name a").next().attr("href");
        // Sorts
        const size = $(element).find(".size").text().trim();
        const seeds = parseInt($(element).find(".seeds").text().trim());
        const leeches = parseInt($(element).find(".leeches").text().trim());
        const time = $(element).find(".coll-date").text().trim();

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

  getUrl(category, query, limitPage) {  
    let cat = this.getValueOfCategories(category); 
    let url =
      this.baseUrl + (cat.startsWith("all:") ? cat.substr(4) : this.searchUrl);

    url = url
      .replace("{query}", query)
      .replace("{category}", category)
      .replace("{limit}", limitPage);
    return url;
  }

  getValueOfCategories(catName) {
    if (!catName || !this.categories[catName]) {
      this.size = catName;

      return this.categories[this.defaultCategory];
    } 
    return this.categories[catName];
  }

  sortBy(torrents, field, order) {
    return torrents.sort((a, b) =>
      order === "desc" ? b[field] - a[field] : a[field] - b[field]
    );
  }

  filterBySize(torrents, threshold) {
    return torrents.filter((item) => item.size <= threshold);
  }

  async getTorrentDetails(torrent) {
    try {
      const body = await cloudscraper.get(torrent);
      return body;
    } catch (err) {
      console.log(err);
    }
  }

  async getMagnet(torrent) {
    try {
      const body = await this.getTorrentDetails(torrent.torrentLink);
      const $ = Cheerio.load(body);

      const magnet = $("a.torrentdown1").attr("href");
      return magnet;
    } catch (err) {
      console.log(err);
    }
  }

  limitResults(torrents, limit) {  
    return torrents.slice(0, limit);
  }
}

module.exports =torrentSource;
