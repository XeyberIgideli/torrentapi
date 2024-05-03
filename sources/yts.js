import TorrentSource from '../lib/torrentSource.js'

class Yts extends TorrentSource {
  constructor() {
    const source = {
      name: "Yts",
      api: true,
      categories: {
          All: "",
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
        baseUrl: "https://yts.mx/",
        searchUrl: "/api/v2/list_movies.json?query_term={query}&limit={limit}",
        size:1200,
        resultsPerPage: 20
        
     }

    super(source) 
  }

}



export default Yts