import bencode from 'bencode'
export default async function toMagnetURI (torrentUrl, infoHash, torrentName) {
    // Fetch the torrent file
    const response = await fetch(torrentUrl)
    const data = await response.arrayBuffer()
    const decoder = Buffer.from(data);
    
    // Decode the torrent file
    const decodedTorrent = bencode.decode(decoder, 'utf8')
    const trackers = [].concat(...decodedTorrent['announce-list'])
    
    // Create the magnet URI
    const trackerString = trackers.length > 0 ? `&tr=${trackers.join('&tr=')}` : ''
    const magnetURI = `magnet:?xt=urn:btih:${infoHash}&dn=${torrentName}${trackerString}`

    return magnetURI
}