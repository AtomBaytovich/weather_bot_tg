const path = require('path');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const { loadImage } = require('canvas');

const width = 680;
const height = 360;
const imgPath = path.join('./public', 'images', 'blur.jpg');

const createImageChartWeather = async ({ time = [], temp = [], label = 'Сводка погоды' }) => {
    // подключаем картинку для заднего фона относительно папки всего проекта
    const img = await loadImage(imgPath);
    // стандартная конфигурация chart.js
    const configuration = {
        type: 'line',
        data: {
            labels: time,
            datasets: [{
                label,
                data: temp,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1,
                color: '#fff'
            }]
        },
        options: {
            plugins: {}
        },
        plugins: [{
            id: 'background-colour',
            beforeDraw(chart) {
                // применяем некоторые стили и картинку на задний фон для графика
                const canvas = chart.canvas;
                const ctx = chart.canvas.getContext("2d");
                ctx.save();
                ctx.globalAlpha = 0.5;
                const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
                // get the top left position of the image
                const x = (canvas.width / 2) - (img.width / 2) * scale;
                const y = (canvas.height / 2) - (img.height / 2) * scale;
                ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
                ctx.restore();
            },
        }]
    };
    // default настройки под себя
    const chartCallback = (ChartJS) => {
        ChartJS.defaults.responsive = true;
        ChartJS.defaults.maintainAspectRatio = false;
    };

    // создаём функцию-конструктор с передачей определённых параметров 
    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, chartCallback });
    // перевод в буффер картинку
    const buffer = await chartJSNodeCanvas.renderToBuffer(configuration);
    // await fs.writeFile('./example.png', buffer, () => console.log('The file was successfully generated'));
    return buffer;
}

module.exports = {
    createImageChartWeather
}