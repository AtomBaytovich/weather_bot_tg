const moment = require('moment');

// средняя сумма значений массива
const getAverage = (numbers) => {
    const sum = numbers.reduce((acc, number) => acc + number, 0);
    return sum;
}

// упорядочить массив по дням и средним температурам
async function definitionAverageWeatherHours({ time, temp, hours = 24 }) {
    let i = 0;
    let count = 0;
    let days = [];
    let tempDays = [];

    for await (let item of time) {
        i++;
        count++;
        if (i == hours) {
            // заносим начало нового дня 
            days.push(moment(time[count - i]).format("DD.MM"))
            // заносим среднюю температуру значения hours 
            const averageTemperature = (getAverage(temp.slice(count - i, count)) / i).toFixed(1);
            tempDays.push(averageTemperature)
            i = 0;
        }
    }

    return {
        days,
        tempDays
    }
}


module.exports = {
    getAverage,
    definitionAverageWeatherHours
}