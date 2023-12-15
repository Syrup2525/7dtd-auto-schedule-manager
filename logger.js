const path = require('path')

const { createLogger, format, transports } = require('winston')
const { combine, timestamp, printf, colorize, splat } = format

const winstonDaily = require('winston-daily-rotate-file')

const logDir = path.join(__dirname, 'logs')

const { LOG_LEVEL } = require('./common/define.js')

const levels = [
    { level: LOG_LEVEL.ERROR, color: "red" },
    { level: LOG_LEVEL.INFO, color: "blue" },
    { level: LOG_LEVEL.DEBUG, color: "green" },
]

const myCustomLevels = {
    levels: () => {
        const list = {}

        let index = 0

        for (const level of levels) {
            list[level.level] = index
            index += 1
        }

        return list
    },
    colors: () => {
        const list = {}

        for (const level of levels) {
            list[level.level] = level.color
        }

        return list
    }
};

const consoleFormat = combine(
    colorize({ colors: myCustomLevels.colors() }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    splat(),
    printf(({ level, message, timestamp }) => {
        return `[${timestamp}] [${level}] : ${message}`
    })
);

const fileFormat = combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    splat(),
    printf(({ level, message, timestamp }) => {
        return `[${timestamp}] [${level}] : ${message}`
    })
);

const logger = createLogger({
    levels: myCustomLevels.levels(),
    format: fileFormat,
    transports: [
        new winstonDaily({
            level: LOG_LEVEL.DEBUG, // 최하위 레벨에선
            datePattern: 'YYYY-MM-DD', // 파일 날짜 형식
            // datePattern: 'YYYY-MM-DD-HH', // 파일 날짜 형식
            dirname: logDir, // 파일 경로
            filename: `%DATE%.log`, // 파일 이름
            maxFiles: 30, // 최근 30개 로그 파일을 남김
            zippedArchive: true,
        }),
        new winstonDaily({
            level: LOG_LEVEL.INFO, // info 레벨에선
            datePattern: 'YYYY-MM-DD', // 파일 날짜 형식
            dirname: logDir + '/info', // 파일 경로
            filename: `%DATE%.log`, // 파일 이름
            maxFiles: 30, // 최근 30일치 로그 파일을 남김
            zippedArchive: true,
        }),
        new winstonDaily({
            level: LOG_LEVEL.ERROR, // error 레벨에선
            datePattern: 'YYYY-MM-DD',
            dirname: logDir + '/error', // /logs/error 하위에 저장
            filename: `%DATE%.error.log`, // 에러 로그는 2020-05-28.error.log 형식으로 저장
            maxFiles: 30,
            zippedArchive: true,
        }),
    ],
})

logger.add(new transports.Console({
    level: LOG_LEVEL.DEBUG,
    format: consoleFormat,
}))

module.exports = {
    error: (string, ...data) => {
        logger.error(string, data)
    },
    info: (string, ...data) => {
        logger.info(string, data)
    },
    debug: (string, ...data) => {
        logger.debug(string, data)
    },
}