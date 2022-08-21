// команды для бота 

const {
    mainMenu
} = require("../utils/buttons")

const start = (ctx) =>
    ctx.reply(`
        ❤️ Привет, ${ctx.update.message.from.first_name}! 
    ❔ Я бот - погодник, помогу узнать быстро погоду по твоему местоположению
        
    🥷 Твои данные никуда не утекут. Мне всё равно кто ты и откуда 💋
        
    🖥 Используй кнопки для навигации со мной 
    `, {
        disable_web_page_preview: true,
        parse_mode: 'HTML',
        ...mainMenu
    });

const backMenu = ctx =>
    ctx.reply(`✅ Ты находишься в меню`, {
        disable_web_page_preview: true,
        parse_mode: 'HTML',
        ...mainMenu
    });

const startWhatWeather = ctx => {
    /*
    1. Бот запрашивает геопозицию человека в ТГ
    2. Человек по кнопке или через вложения отправляет своё местоположение
    3. Нам приходят даннные и мы отправляет через API запрос по погоде по координатам его
    4. Обработка
    */
    // входим в зарегистрированную в bot.js (15 строка) сцену
    return ctx.scene.enter('weather');
}

module.exports = {
    start,
    backMenu,
    startWhatWeather
}