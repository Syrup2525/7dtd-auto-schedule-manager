const cron = require('node-cron')
const logger = require('./logger.js')
const dedicatedServer = require('./model/dedicatedServer.js')
const { 
    cronDateToString,
    getSpendCronExpression, } = require('./common/util.js')
const settingTimes = require('./setting.json')

/**
 * 서버 공지 스케줄 등록 (serverStopTime 기준 30분전, 10분전, 5분전, 1분전에 공지됨)
 * @param {string} stopCronExpression 종료 cronExpression
 */
const scheduleServerNotice = (stopCronExpression) => {
    // 30분전, 10분전, 5분전, 1분전
    const previousMinuteList = [30, 10, 5, 1]

    for (const previousMinute of previousMinuteList) {
        const scheduleTime = getSpendCronExpression(stopCronExpression, previousMinute * (-1))

        try {
            cron.schedule(scheduleTime, async () => {
                await dedicatedServer.sendMessage(`약 ${previousMinute}분 후에 서버가 종료됩니다.`)
            })
        } catch (err) {
            logger.error(`[fail] scheduleServerNotice \n%o`, err)
            return false
        }
    }

    return true
}

/**
 * 서버 스케줄 등록
 * @param {*} dayOfWeek 0: 일요일, 5: 토요일
 * @param {*} serverStartTime 서버 시작 시간 
 * @param {*} spendMinute 서버 시작 후 종료까지 걸리는 시간
 */
const scheduleRegist = (dayOfWeek, serverStartTime, spendMinute) => {
    const splitTime = serverStartTime.split(":")
    const hour = Number(splitTime[0])
    const minute = Number(splitTime[1])

    /* 서버 시작 */
    const startCronExpression = `${minute} ${hour} * * ${dayOfWeek}`

    try {
        cron.schedule(startCronExpression, async () => {
            await dedicatedServer.start()
        })
    } catch (err) {
        logger.error(`[fail] scheduleServerStart \n%o`, err)
        return 
    }

    const stopCronExpression = getSpendCronExpression(startCronExpression, spendMinute)

    /* 서버 종료 전 공치 출력 */
    const isSuccess = scheduleServerNotice(stopCronExpression)

    if (!isSuccess) {
        return
    }

    /* 서버 종료 */
    try {
        cron.schedule(stopCronExpression, async () => {
            await dedicatedServer.stop()
        })
    } catch (err) {
        logger.error(`[fail] scheduleServerStop \n%o`, err)
        return 
    }

    logger.info(`[success] [schedule] ${cronDateToString(startCronExpression)} ~ ${cronDateToString(stopCronExpression)}`)
}

const start = async () => {
    logger.info(` ________  ________  _________  ________      ________  ________  _____ ______   `)
    logger.info(`|\\_____  \\|\\   ___ \\|\\___   ___\\\\   ___ \\    |\\   __  \\|\\   ____\\|\\   _ \\  _   \\     `)
    logger.info(` \\|___/  /\\ \\  \\_|\\ \\|___ \\  \\_\\ \\  \\_|\\ \\   \\ \\  \\|\\  \\ \\  \\___|\\ \\  \\\\\\__\\ \\  \\  `)
    logger.info(`     /  / /\\ \\  \\ \\\\ \\   \\ \\  \\ \\ \\  \\ \\\\ \\   \\ \\   __  \\ \\_____  \\ \\  \\\\|__| \\  \\  `)
    logger.info(`    /  / /  \\ \\  \\_\\\\ \\   \\ \\  \\ \\ \\  \\_\\\\ \\   \\ \\  \\ \\  \\|____|\\  \\ \\  \\    \\ \\  \\ `)
    logger.info(`   /__/ /    \\ \\_______\\   \\ \\__\\ \\ \\_______\\   \\ \\__\\ \\__\\____\\_\\  \\ \\__\\    \\ \\__\\ `)
    logger.info(`   |__|/      \\|_______|    \\|__|  \\|_______|    \\|__|\\|__|\\_________\\|__|     \\|__|`)
    logger.info(`                                                          \\|_________|            `)

    /* === 서버 시작 === */
    logger.info(``)
    logger.info(``)
    logger.info(`===== schedule regist =====`)

    for (const settingTime of settingTimes) {
        scheduleRegist(settingTime.dayOfWeek, settingTime.startTime, settingTime.spendMinute)
    }

    logger.info(``)
    logger.info("Regist Schedule All Success")
}

exports.start = start
