import path from 'path'
import torrentSource from './torrentSource.js'
import {readdirSync} from 'fs'

class sourceManager {
    constructor() {
        this.sourceDir = "" 
    }
      async setSource(sourceName) {
        const param = await this.importSource(sourceName) 
        return this.instantiateSource(param)
      } 
      
     instantiateSource (Source) {   
      const sourceClass = Source.default
      return new torrentSource(new sourceClass())
      }
       
      loadSources (srcDir) { 
        this.sourceDir = srcDir  
        const sourcePaths =  readdirSync(path.resolve(srcDir))
        .filter(item => item.endsWith('.js'))
        .map(filename => path.resolve(srcDir, filename))  
        
        return sourcePaths
      }
      
     async importSource (sourceName) {  
        const modulePath = 'file://' + path.resolve(path.join(this.sourceDir, sourceName + ".js"))
        const importModule = await import(modulePath)
        return importModule
      }
    
}

export default sourceManager