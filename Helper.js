import bencode from 'bencode'
import WebTorrent from 'webtorrent'
import fs from 'fs'
async function toMagnetURI (torrentUrl, infoHash, torrentName) {
    // Fetch the torrent file
    const response = await fetch(torrentUrl)
    const data = await response.arrayBuffer()
    const decoder = Buffer.from(data)
    
    // Decode the torrent file
    const decodedTorrent = bencode.decode(decoder, 'utf8')
    const trackers = [].concat(...decodedTorrent['announce-list'])
    
    // Create the magnet URI
    const trackerString = trackers.length > 0 ? `&tr=${trackers.join('&tr=')}` : ''
    const magnetURI = `magnet:?xt=urn:btih:${infoHash}&dn=${torrentName}${trackerString}`

    return magnetURI
}
function MagnetToTorrent (magnetUri, filePath) {
    const client = new WebTorrent()

    client.add(magnetUri, { metadataOnly: true }, (torrent) => {
        const info = torrent.torrentFile
        
        fs.writeFileSync(`${filePath}/${torrent.name}.torrent`, info,(err) => {
            if (err) {
             throw new Error('Error writing torrent file:', err);
             
            }
            console.log('Torrent file has been saved as:', torrent.name);
          }) 
        client.destroy()
    })


}

export {toMagnetURI, MagnetToTorrent}