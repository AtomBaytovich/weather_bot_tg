const { default: axios } = require('axios');
const { Scenes } = require('telegraf');
const { backMenu } = require('../controllers/commands');
const { backButtonMenuAndLocation } = require('../utils/buttons');

// https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relativehumidity_2m,windspeed_10m&current_weather=true&timezone=auto
const url = `https://api.open-meteo.com/v1/forecast`;

// передаём конструктору название сцены и шаги сцен
const whatWeatherScene = new Scenes.BaseScene('weather');

whatWeatherScene.enter(ctx => ctx.reply('✨ Пришли мне свою геопозицию', {
    ...backButtonMenuAndLocation
}));

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

        // делаем get запрос с query параметрами и деструктуризируем ответ - data 
        const {
            data
        } = await axios.get(url, {
            params: {
                latitude,
                longitude,
                'hourly': 'temperature_2m,relativehumidity_2m,windspeed_10m',
                'current_weather': true,
                'timezone': 'auto'
            }
        });
        // отвечаем сообщением о погоде
        ctx.reply(`Сейчас у тебя ${data.current_weather.temperature}${data.hourly_units.temperature_2m}\nВетер ${data.current_weather.windspeed} ${data.hourly_units.windspeed_10m}`)
    } catch (error) {
        console.log(error)
        ctx.reply('Упс... Произошла какая - то ошибка');
    }
})

// вешаем прослушку hears на сцену
whatWeatherScene.hears('✅ В меню', ctx => {
    // выходим со сцены
    ctx.scene.leave();
    return backMenu(ctx);
})

// экспортируем сцену
module.exports = {
    whatWeatherScene
};
