const { Telegraf, Scenes } = require('telegraf');
const { CMD_TEXT } = require('../config/consts');
const { backMenu } = require('../controllers/commands');
const {
    geocoderLocation,
    getWeatherLocationCoord
} = require('../services/getWeatherLocation');
const {
    backButtonMenu,
    mainMenu
} = require('../utils/buttons');
const { guessTemperature } = require('../utils/guessTemperature');

// первый шаг сцены
const stepOne = Telegraf.on('text', async ctx => {
    try {
        const msg = ctx.message;
        // console.log(msg)
        const numberText = msg.text
        if (!Number(numberText) || numberText < -60 || numberText > 60) return ctx.reply('❌ Неверный ввод. Повтори с другим значением');
        
        ctx.reply('♨️ Спасибо. Посмотрим на сколько ты прав.\n✏️ Теперь введи адрес')
        // указываем state для следующего шага сцены
        ctx.scene.state.guessTemperature = numberText;
        // говорим, чтобы перешёл к следующему шагу
        ctx.wizard.next();
    } catch (error) {
        console.log(error)
        ctx.reply('Упс... Произошла какая - то ошибка');
    }
});

// второй шаг сцены
const stepTwo = Telegraf.on('text', async ctx => {
    try {
        const msg = ctx.message;
        // console.log(msg)

        const location = await geocoderLocation(msg.text);
        if (!location) return ctx.reply('Упс... Я не могу найти такого места. Попробуй другое!')
        // console.log(location[0])

        const data = await getWeatherLocationCoord({
            latitude: location[0].lat,
            longitude: location[0].lon
        });
        // отвечаем сообщением о погоде
        ctx.reply(`Сейчас там ${data.current_weather.temperature}${data.hourly_units.temperature_2m}\nВетер ${data.current_weather.windspeed} ${data.hourly_units.windspeed_10m}`, {
            ...mainMenu
        })
        // отвечаем разницей в температуре
        ctx.reply(`🎮 ${guessTemperature(ctx.scene.state.guessTemperature, data.current_weather.temperature)}`)
        // выходим со сцены
        ctx.scene.leave();
    } catch (error) {
        console.log(error)
        ctx.reply('Упс... Произошла какая - то ошибка');
    }
});

// передаём конструктору название сцены и шаги сцен
const whatWeatherNotIScene = new Scenes.WizardScene('weatherNotI', stepOne, stepTwo)

whatWeatherNotIScene.enter(ctx => ctx.reply('❓ Для начала отгадай сколько там градусов будет?\n✏️ Введи число от -60 до 60', {
    ...backButtonMenu
}));

// вешаем прослушку hears на сцену
whatWeatherNotIScene.hears(CMD_TEXT.menu, ctx => {
    ctx.scene.leave();
    return backMenu(ctx);
})

// экспортируем сцену
module.exports = {
    whatWeatherNotIScene
}; 