const guessTemperature = (temp_user, temp_api) => {
    if (temp_user == temp_api) return 'Идеально! Ты угадал температуру! Красава!';
    return `Ты не угадал... Разница температур составила ${(temp_user - temp_api).toFixed(1)}°C`
}

module.exports = {
    guessTemperature
}