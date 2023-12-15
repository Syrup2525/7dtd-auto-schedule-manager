const core = require('./core.js')
const logger = require('./logger.js')

try {
    core.start()
} catch (error) {
    logger.error(`Main Error \n%o`, error)
}