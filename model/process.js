const { exec } = require('child_process')
const logger = require('../logger.js')

const execute = (filePath) => {
    logger.info(`[try] process.execute: ${filePath}`)

    exec(filePath, (error, stdout, stderr) => {
        if (error) {
            logger.error(`[fail] process.execute \n%o`, error)
        } else {
            logger.info(`[success] process.execute`)
        }
    })
}

module.exports = {
    execute,
}