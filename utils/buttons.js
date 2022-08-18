// кнопки для бота
const { Markup } = require('telegraf');

const mainMenu =
    Markup.keyboard([
        ['🌏 Узнать погоду'],
    ]).resize()

const backButtonMenu =
    Markup.keyboard([
        ['✅ В меню'],
    ]).resize()

const backButtonMenuAndLocation =
    Markup.keyboard([
        Markup.button.locationRequest('Мое местоположение'),
        Markup.button.text('✅ В меню'),
    ]).resize()

module.exports = {
    mainMenu,
    backButtonMenu,
    backButtonMenuAndLocation
}