const { default: axios } = require('axios');
const {
    URL_API_WEATHER,
    URL_API_GEOCODER
} = require("../config/consts");

// стрелочная функция для получения температуры по координатам
const getWeatherLocationCoord = async ({ longitude, latitude }) => {
    // делаем get запрос с query параметрами, деструктуризируем и возвращаем ответ data
    const { data } = await axios.get(URL_API_WEATHER, {
        params: {
            latitude,
            longitude,
            'hourly': 'temperature_2m,relativehumidity_2m,windspeed_10m',
            'current_weather': true,
            'timezone': 'auto'
        }
    });
    return data;
}

// стрелочная функция обратного геокодирования адреса
/*
    Прямое геокодирование – это задача получения координат географической
    точки по её адресу, написанному на понятном человеческом языке.

    Обратное геокодирование-это процесс преобразования местоположения, 
    описанного географическими координатами (широта, долгота), 
    в удобочитаемый адрес или название места.
*/
const geocoderLocation = async (address) => {
    // делаем URL валидным
    const url = new URL(`${URL_API_GEOCODER}/${address}`).href;
    const { data } = await axios.get(url, {
        params: {
            'format': 'json',
            'addressdetails': '1',
            'limit': '1'
        }
    });
    return data;
}

module.exports = {
    getWeatherLocationCoord,
    geocoderLocation
}