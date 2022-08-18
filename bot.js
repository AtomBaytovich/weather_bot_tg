const { Scenes, Telegraf } = require('telegraf');
// сессии для mongoose 
const { session } = require("telegraf-session-mongoose");
// подключение всех команд для стандартных методов прослушек 
const {
    start,
    backMenu,
    startWhatWeather,
} = require('./controllers/commands');
const { whatWeatherScene } = require('./controllers/weatherScenes');

// инициализация
const bot = new Telegraf(process.env.BOT_TOKEN);
// регистрируем сцены
const stage = new Scenes.Stage([whatWeatherScene])

const setupBot = () => {
    // подключение сессий с коллекцией в бд и сцен
    bot.use(session({ collectionName: 'sessions' }));
    bot.use(stage.middleware())

    // команда "/start"
    bot.command("start", start);
    // прослушка на сообщение 
    bot.hears('✅ В меню', backMenu)
    bot.hears('🌏 Узнать погоду', startWhatWeather)


    return bot;
}


module.exports = {
    setupBot
}