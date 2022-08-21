//TG: https://t.me/atom_baytovich

// подключаем конфиги (переменные окружения ноды - process.env)
require('dotenv').config({ path: './config/.env' })

const mongoose = require('mongoose');

const { setupBot } = require('./bot');

// рекурсивная асинхронная функция, которая подключается к бд и после запускает бота tg 
(async function () {
    try {
        // подключение к БД
        await mongoose.connect(process.env.BD_TOKEN, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            dbName: 'tgBot'
        });
        // запуск самого бота
        await setupBot().launch();
        // другая реализация запуска
        /* 
        const bot = setupBot();
        await bot.launch()
        */
        console.log("</ Бот успешно запущен >")
    } catch (error) {
        console.log('Ошибка запуска: ', error)
    }
}())
