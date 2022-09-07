// кнопки для бота
const { Markup } = require('telegraf');
const { CMD_TEXT } = require('../config/consts');

const mainMenu =
    Markup.keyboard([
        [CMD_TEXT.weaterI],
        [CMD_TEXT.weatherNotI]
    ]).resize()

const backButtonMenu =
    Markup.keyboard([
        [CMD_TEXT.menu],
    ]).resize()

const backButtonMenuAndLocation =
    Markup.keyboard([
        Markup.button.locationRequest('Мое местоположение'),
        Markup.button.text(CMD_TEXT.menu),
    ]).resize()

const startCallbackButton =
    Markup.inlineKeyboard([
        Markup.button.callback(
            'Старт',
            'test_callback'
        ),
    ]).resize()

module.exports = {
    mainMenu,
    backButtonMenu,
    backButtonMenuAndLocation,
    startCallbackButton
}