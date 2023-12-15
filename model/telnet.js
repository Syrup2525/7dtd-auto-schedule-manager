const { Telnet } = require('telnet-client')
const { delay } = require('../common/util.js')
const logger = require('../logger.js')
const { COMMAND } = require('../common/define.js')

require('dotenv').config()

const HOST = process.env.TELNET_HOST
const PORT = process.env.TELNET_PORT
const PASSWORD = process.env.TELNET_PASSWORD

const options = {
    host: HOST,
    port: PORT,
    negotiationMandatory: false,
    loginPrompt: null,
    passwordPrompt: null,
    username: null,
    password: null,
}

/**
 * Telnet 커멘드 전송
 * @param {string} command 실행할 커맨드
 * @returns 
 */
const excuteCommand = async (command) => {
    const connection = new Telnet()

    try {
        logger.info(`[try] telnet.excuteCommand: ${command}`)

        await connection.connect(options)
        await delay(500)
        await connection.send(PASSWORD)
        await delay(500)
        await connection.send(command)
        await delay(500)
        await connection.send(COMMAND.EXIT)
        logger.info(`[success] telnet.excuteCommand`)
    } catch (error) {
        return
    }
}

module.exports = {
    excuteCommand,
}