const sourceManager = require('./sourceManager')

function initApi (sourceDir) {
    let srcManager = new sourceManager() 
    srcManager.loadSources(sourceDir) 
    return srcManager
}

module.exports = initApi