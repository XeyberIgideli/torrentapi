# torrentApi

## Supported sources
- 1377x
- Yts

## Features
- Search: Search for torrents based on keywords or specific criteria.
- Torrent Details: Get detailed information about a specific torrent.
- Download Torrent: Download a torrent file directly.
- Get Magnet Link: Retrieve the magnet link for a torrent.

## Installation
`npm install @pardaillan/torrent-api`

# Usage

## Parameters      
- query: search query
- category: category to search in
- limit: limit the number of results
- size: limit the size of results
- sortBy: sort by seeds,leeches,date,size
- sortOrder: asc or desc

## Quick Example
```javascript
import torrentApi from 'torrent-api'

const source = await torrentApi.setSource('1377x');

// Search 'Matrix' in 'Movies' category and limit to 20 results under 1300 Mb
const torrents = await source.search({query:'Matrix', category:'Movies', limit: 20, size: 1300});
```
## Search torrent
```javascript 
const torrents = await source.search({query:'Matrix', category:'Movies', limit: 20, size: 1300});
```

## Torrent details
```javascript 
const torrentDetails = await source.getTorrentDetails(torrent);
```

## Download torrent
```javascript 
const torrentDownload = await source.getTorrent(torrent, path);
```

## Torrent magnet link
```javascript 
const torrentMagnet = await source.getMagnet(torrent);
```
