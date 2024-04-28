const TorrentSource = require("../torrentSource.js")

class _1377x extends TorrentSource {
  constructor() {
    const source = {
      name: "1377x",
      categories: {
          All: "all:/search/{query}/{limit}/",
          Movies: "Movies",
          TV: "TV",
          Music: "Music",
          Games: "Games",
          Applications: "Applications",
          Documentaries: "Documentaries",
          Anime: "Anime",
          Other: "Other",
          XXX: "XXX",
        },
        defaultCategory: "All",
        baseUrl: "https://www.1377x.to",
        searchUrl: "/category-search/{query}/{category}/{limit}/",
        size:1200,
        resultsPerPage: 20
        
     }

    super(source) 
  }
}



module.exports = _1377x