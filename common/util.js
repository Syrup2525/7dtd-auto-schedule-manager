const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 
 * @param {string} cronDate 
 * @returns 
 */
const cronDateToString = (cronDate) => {
    const day = {
        0: "일",
        1: "월",
        2: "화",
        3: "수",
        4: "목",
        5: "금",
        6: "토",
    }

    const cronExpressions = cronDate.split(" ")

    const minute = cronExpressions[0]
    const hour = cronExpressions[1]
    const dayOfWeek = cronExpressions[4]

    return `[${day[dayOfWeek]}] ${("0" + hour).slice(-2)}:${("0"+minute).slice(-2)}`
}

/**
 * 
 * @param {string} cronExpression
 * @param {number} spendMinute 
 * @returns 
 */
const getSpendCronExpression = (cronExpression, spendMinute) => {
    const splitTime = cronExpression.split(" ")
    const minute = Number(splitTime[0])
    const hour = Number(splitTime[1])
    const dayOfWeek = Number(splitTime[4])

    let date = new Date()

    if (dayOfWeek === 0) {
        date = new Date(`2023-04-30`)
    } else {
        date = new Date(`2023-05-0${dayOfWeek}`)
    }

    date.setHours(hour)
    date.setMinutes(minute + spendMinute)

    return `${date.getMinutes()} ${date.getHours()} * * ${date.getDay()}`
}

module.exports = {
    getSpendCronExpression,
    cronDateToString,
    delay,
}