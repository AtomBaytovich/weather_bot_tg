// команды для бота 

const {
    mainMenu,
    backButtonMenuAndLocation
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
    ctx.reply('✨ Пришли мне свою геопозицию', {
        ...backButtonMenuAndLocation
    })
    // входим в зарегистрированную в bot.js (15 строка) сцену
    return ctx.scene.enter('weather');
}

module.exports = {
    start,
    backMenu,
    startWhatWeather
}