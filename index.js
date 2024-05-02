// const torrentSource = require('./torrentSource')  
// const initApi = require('./initApi')
// const path = require('path')
import path from 'path'
import url from 'url' 
import initApi from './initApi.js'

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 

export default initApi(path.join(__dirname,'./sources')) 

