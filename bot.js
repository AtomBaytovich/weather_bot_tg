const { Scenes, Telegraf } = require('telegraf');
// сессии для mongoose 
const { session } = require("telegraf-session-mongoose");
// тектовые команды
const { CMD_TEXT } = require('./config/consts');
// подключение всех команд для бота
const {
    start,
    backMenu,
    startWhatWeather,
    whatWeatherNotI,
    exampleStartCallback,
} = require('./controllers/commands');

const { whatWeatherNotIScene } = require('./controllers/weatherNotIScene');
const { whatWeatherScene } = require('./controllers/weatherScene');

// инициализация
const bot = new Telegraf(process.env.BOT_TOKEN);
// регистрируем сцены
const stage = new Scenes.Stage([whatWeatherScene, whatWeatherNotIScene])

const setupBot = () => {
    // подключение промежуточных обработчиков (middleware) 
    // сессий с коллекцией в бд и сцен
    bot.use(session({ collectionName: 'sessions' }));
    bot.use(stage.middleware())
    // обычный middleware (пример)
    bot.use((ctx, next) => {
        // console.log(ctx)
        return next()
    })
    // команда "/start" аналог cmd.command('start', handler)
    bot.start(start);
    // прослушка на сообщение 
    bot.hears(CMD_TEXT.menu, backMenu)
    bot.hears(CMD_TEXT.weaterI, startWhatWeather)
    bot.hears(CMD_TEXT.weatherNotI, whatWeatherNotI)

    // пример использования callback button
    bot.hears('start_scene_callback', exampleStartCallback)
    // ловим callback и заходим в сцену
    bot.action('test_callback', whatWeatherNotI)

    return bot;
}


module.exports = {
    setupBot
}