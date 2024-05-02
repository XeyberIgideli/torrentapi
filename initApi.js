import sourceManager from "./lib/sourceManager.js"

function initApi (sourceDir) {
    let srcManager = new sourceManager() 
    srcManager.loadSources(sourceDir) 
    return srcManager
}

export default initApi