import path from 'path'
import torrentSource from './torrentSource.js'
import {readdirSync, existsSync} from 'fs'

class sourceManager {
    constructor() {
        this.sourceDir = "" 
    }
    async setSource(sourceName) {
        if(!sourceName) {
          throw new Error("No source provided!")
        } 
        const param = await this.#importSource(sourceName) 
        return this.#instantiateSource(param)
      } 
      
    #instantiateSource (Source) {   
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
      
    async #importSource (sourceName) {  
        const modulePath = path.resolve(path.join(this.sourceDir, sourceName + ".js")) 
        const moduleFilePath = 'file://' + path.resolve(path.join(this.sourceDir, sourceName + ".js"))
         
        if(!existsSync(modulePath)) {
          throw new Error("Provided source is not exist!")
        }
        const importModule = await import(moduleFilePath)
        return importModule
      }
    
}

export default sourceManager