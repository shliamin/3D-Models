import { linspace, calculateArcLength, perfectArc } from './model-utils.js';

// model.js

export function updateModel() {
    // Получение значений в сантиметрах и конвертация в метры
    const width = parseFloat(document.getElementById('width').value) / 100;
    const depth = parseFloat(document.getElementById('depth').value) / 100;
    const height = parseFloat(document.getElementById('height').value) / 100;

    const maxDim = Math.max(width, depth, height);

    // Масштабирование координат вершин
    let vertices = [
        [0, 0, 0],                             // Нижний передний левый угол
        [width / maxDim, 0, 0],                // Нижний передний правый угол
        [0, depth / maxDim, 0],                // Нижний задний левый угол
        [width / maxDim, depth / maxDim, 0],   // Нижний задний правый угол
        [width / (2 * maxDim), depth / (2 * maxDim), height / maxDim]  // Верхняя центральная точка
    ];

    // Создание арок
    let arc1 = perfectArc(vertices[0], vertices[3], height / maxDim);
    let arc2 = perfectArc(vertices[1], vertices[2], height / maxDim);

    // Вычисление длин арок
    let arcLength1 = calculateArcLength(arc1);
    let arcLength2 = calculateArcLength(arc2);

    // Инициализация данных для графика
    let data = [];

    // Добавление арок на график
    data.push({
        x: arc1.x,
        y: arc1.y,
        z: arc1.z,
        mode: 'lines',
        line: {
            color: 'blue',
            width: 5
        },
        type: 'scatter3d'
    });
    data.push({
        x: arc2.x,
        y: arc2.y,
        z: arc2.z,
        mode: 'lines',
        line: {
            color: 'blue',
            width: 5
        },
        type: 'scatter3d'
    });

    // Обновление длин арок
    document.getElementById('arcLength').innerText = `Arcs length: ${(arcLength1 + arcLength2).toFixed(2)} m`;

    let layout = {
        scene: {
            xaxis: {
                title: 'Width',
                dtick: 0.1, // Шаг сетки по оси X 10 см
                range: [0, 1] // Установите диапазон по оси X в масштабированном пространстве
            },
            yaxis: {
                title: 'Depth',
                dtick: 0.1, // Шаг сетки по оси Y 10 см
                range: [0, 1] // Установите диапазон по оси Y в масштабированном пространстве
            },
            zaxis: {
                title: 'Height',
                dtick: 0.1, // Шаг сетки по оси Z 10 см
                range: [0, 1] // Установите диапазон по оси Z в масштабированном пространстве
            },
            aspectratio: {
                x: 1, // Установим фиксированные значения для пропорций
                y: 1,
                z: 1
            },
            camera: {
                eye: {
                    x: 2, // Отрегулируйте эти значения для отдаления камеры
                    y: 1,
                    z: 2
                },
                center: {
                    x: 0.5, // Сдвинуть вправо (положительное значение)
                    y: 0,
                    z: 0.1 // Сдвинуть вниз (отрицательное значение)
                }
            }
        },
        legend: {
            y: -0.2,
            yanchor: 'top'
        },
        margin: {
            l: 0,
            r: 0,
            b: 0,
            t: 0
        }
    };

    Plotly.newPlot('tentModel', data, layout);
}
