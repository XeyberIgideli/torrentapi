const torrentSource = require('./torrentSource') 
const path = require('path')
const {readdirSync} = require('fs')

class sourceManager {
    constructor() {
        this.sourceDir = "" 
    }
      setSource(sourceName) {
        const param = this.importSource(sourceName)
        return this.instantiateSource(param)
      } 
      
      instantiateSource (Source) {  
        return new torrentSource(new Source())
      }
       
      loadSources (srcDir) { 
        this.sourceDir = srcDir  
        const sourcePaths =  readdirSync(path.resolve(srcDir))
        .filter(item => item.endsWith('.js'))
        .map(filename => path.resolve(srcDir, filename))  
        
        return sourcePaths
      }
      
      importSource (sourceName) {  
        return require(path.join(this.sourceDir, sourceName + ".js"))
      }
    
}

module.exports = sourceManager