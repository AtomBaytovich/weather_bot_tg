const { Scenes } = require('telegraf');
const { backMenu } = require('./commands');
const { getWeatherLocationCoord } = require('../services/getWeatherLocation');
const { backButtonMenuAndLocation } = require('../utils/buttons');
const { CMD_TEXT } = require('../config/consts');
const { createImageChartWeather } = require('../services/weatherChart');
const { definitionAverageWeatherHours } = require('../utils/average');

// передаём конструктору название сцены и шаги сцен
const whatWeatherScene = new Scenes.BaseScene('weather');

// при входе в сцену отправляется сообщение
whatWeatherScene.enter(ctx => ctx.reply('✨ Пришли мне свою геопозицию', {
    ...backButtonMenuAndLocation
}));

// создание прослушки на метод location tg
whatWeatherScene.on('location', async ctx => {
    try {
        const msg = ctx.message;
        if (!msg.location) return ctx.reply('Это не геопозиция!')
        ctx.reply('💫 Ищу в базе данных погоду');

        // деструктуризация объектов 
        const {
            latitude,
            longitude
        } = msg.location;

        // получаем нашу погоду по координатам
        const data = await getWeatherLocationCoord({ latitude, longitude });

        // получаем наши перебранные значения для графика
        const averageTemp = await definitionAverageWeatherHours({
            time: data.hourly.time,
            temp: data.hourly.temperature_2m
        })

        // приходит буффер - изображение графика погоды
        const file = await createImageChartWeather({
            label: 'Сводка погоды на неделю',
            time: averageTemp.days,
            temp: averageTemp.tempDays
        });
        // ctx.reply(`Сейчас у тебя ${data.current_weather.temperature}${data.hourly_units.temperature_2m}\nВетер ${data.current_weather.windspeed} ${data.hourly_units.windspeed_10m}`)
        // отвечаем сообщением о погоде
        ctx.replyWithPhoto({
            source: file,
        }, {
            caption: `Сейчас у тебя ${data.current_weather.temperature}${data.hourly_units.temperature_2m}\nВетер ${data.current_weather.windspeed} ${data.hourly_units.windspeed_10m}`
        });
    } catch (error) {
        console.log(error)
        ctx.reply('Упс... Произошла какая - то ошибка');
    }
})

// вешаем текстовую прослушку hears на сцену
whatWeatherScene.hears(CMD_TEXT.menu, ctx => {
    // выходим со сцены
    ctx.scene.leave();
    return backMenu(ctx);
})

// экспортируем сцену
module.exports = {
    whatWeatherScene
};
