const { default: axios } = require('axios');
const { Telegraf, Scenes } = require('telegraf');
const { backMenu } = require('../controllers/commands');

// https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relativehumidity_2m,windspeed_10m&current_weather=true&timezone=auto
const url = `https://api.open-meteo.com/v1/forecast`;

// первый шаг сцены
let stepOne = Telegraf.on('location', async ctx => {
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
        // выходим со сцены
        // return ctx.scene.leave();
    } catch (error) {
        console.log(error)
        ctx.reply('Упс... Произошла какая - то ошибка');
    }
})

// передаём конструктору название сцены и шаги сцен
const whatWeatherScene = new Scenes.WizardScene('weather', stepOne)

// вешаем прослушку hears на сцену
whatWeatherScene.hears('✅ В меню', ctx => {
    ctx.scene.leave();
    return backMenu(ctx);
})

// экспортируем сцену
module.exports = {
    whatWeatherScene
};