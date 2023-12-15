const { COMMAND } = require('../common/define.js')
const logger = require('../logger.js')
const telnet = require('./telnet.js')
const childProcess = require('./process.js')

require('dotenv').config()

const dedicatedServer = {
    /**
     * 서버 시작
     */
    start: async () => {
        try {
            logger.info(`[try] dedicatedServer.start`)

            // 실행할 배치 파일 경로
            const batFilePath = process.env.BATCH_FILE_NAME

            childProcess.execute(batFilePath)
        } catch (err) {
            logger.error(`[fail] dedicatedServer.start \n%o`, err)
        }
    },
    /**
     * 서버 종료
     */
    stop: async () => {
        try {
            logger.info(`[try] dedicatedServer.stop`)

            await telnet.excuteCommand(COMMAND.SHUT_DOWN)
        } catch (err) {
            logger.error(`[fail] dedicatedServer.stop \n%o`, err)
        }
    },
    /**
     * 서버 공지
     * @param {string} message 공지할 내용
     */
    sendMessage: async (message) => {
        try {
            logger.info(`[try] dedicatedServer.sendMessage`)

            await telnet.excuteCommand(`${COMMAND.SAY} "${message}"`)
        } catch (err) {
            logger.error(`[fail] dedicatedServer.sendMessage \n%o`, err)
        }
    },
}

module.exports = dedicatedServer