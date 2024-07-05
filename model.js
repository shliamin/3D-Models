// Импортируем необходимые функции
import {
    calculateArcLength,
    interpolateSurface,
    calculateSurfaceArea,
    createArc,
} from './model-utils.js';

// model.js

export function updateModel() {
    // Получение значений в сантиметрах и конвертация в метры
    const width = parseFloat(document.getElementById('width').value) / 100;
    const depth = parseFloat(document.getElementById('depth').value) / 100;
    const height = parseFloat(document.getElementById('height').value) / 100;

    // Функция для создания линейного интервала
    function linspace(start, stop, num) {
        const arr = [];
        const step = (stop - start) / (num - 1);
        for (let i = 0; i < num; i++) {
            arr.push(start + step * i);
        }
        return arr;
    }

    // Создаем арки
    const arc1 = createArc(width, depth, height);
    const arc2 = createArc(width, depth, height);
    arc2.x = arc2.x.map(x => -x); // Инвертируем координаты x для второй арки

    // Масштабирование осей на основе крайних точек арок
    const allX = arc1.x.concat(arc2.x);
    const allY = arc1.y.concat(arc2.y);
    const allZ = arc1.z.concat(arc2.z);

    const minX = Math.min(...allX);
    const maxX = Math.max(...allX);
    const minY = Math.min(...allY);
    const maxY = Math.max(...allY);
    const minZ = Math.min(...allZ);
    const maxZ = Math.max(...allZ);

    // Вычисление длин арок
    let arcLength1 = calculateArcLength(arc1);
    let arcLength2 = calculateArcLength(arc2);

    // Интерполяция поверхности между арками
    const surface = interpolateSurface(arc1, arc2);

    // Вычисление площади поверхности
    let surfaceArea = calculateSurfaceArea(surface);

    // Инициализация данных для графика
    let data = [];

    // Добавление арок на график
    data.push(arc1);
    data.push(arc2);

    // Добавление поверхности на график
    data.push({
        x: surface.x,
        y: surface.y,
        z: surface.z,
        type: 'surface',
        colorscale: 'Viridis',
        opacity: 0.8
    });

    // Обновление длин арок и площади поверхности
    document.getElementById('arcLength').innerText = `Arcs length: ${(arcLength1 + arcLength2).toFixed(2)} m`;
    document.getElementById('surfaceArea').innerText = `Surface area: ${surfaceArea.toFixed(2)} m²`;

    let layout = {
        scene: {
            xaxis: {
                title: 'Width',
                dtick: 0.1, // Шаг сетки по оси X 10 см
                range: [minX, maxX]
            },
            yaxis: {
                title: 'Depth',
                dtick: 0.1, // Шаг сетки по оси Y 10 см
                range: [0, depth]
            },
            zaxis: {
                title: 'Height',
                dtick: 0.1, // Шаг сетки по оси Z 10 см
                range: [minZ, maxZ]
            },
            aspectratio: {
                x: width / Math.max(width, depth, height),
                y: depth / Math.max(width, depth, height),
                z: height / Math.max(width, depth, height)
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
