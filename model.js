import { calculateArcLength } from './model-utils.js';

// model.js

function circumcircle(x1, y1, x2, y2, x3, y3) {
    // Вычисляем середины отрезков между точками
    let midAB = [(x1 + x2) / 2, (y1 + y2) / 2];
    let midBC = [(x2 + x3) / 2, (y2 + y3) / 2];
    
    // Вычисляем угловые коэффициенты перпендикуляров к отрезкам
    let slopeAB = -(x2 - x1) / (y2 - y1);
    let slopeBC = -(x3 - x2) / (y3 - y2);
    
    // Решаем систему уравнений для нахождения центра окружности
    let centerX = (slopeAB * midAB[0] - slopeBC * midBC[0] + midBC[1] - midAB[1]) / (slopeAB - slopeBC);
    let centerY = slopeAB * (centerX - midAB[0]) + midAB[1];
    
    // Вычисляем радиус окружности
    let radius = Math.sqrt((centerX - x1) ** 2 + (centerY - y1) ** 2);
    
    return { centerX, centerY, radius };
}

export function updateModel() {
    // Получение значений в сантиметрах и конвертация в метры
    const width = parseFloat(document.getElementById('width').value) / 100;
    const depth = parseFloat(document.getElementById('depth').value) / 100;
    const height = parseFloat(document.getElementById('height').value) / 100;

    // Определяем точки для построения окружности
    const x1 = -width / 2, y1 = 0;
    const x2 = width / 2, y2 = 0;
    const x3 = 0, y3 = height;

    // Вычисляем параметры окружности
    const circle = circumcircle(x1, y1, x2, y2, x3, y3);
    
    // Создаем точки на окружности
    const numPoints = 100;
    const theta = linspace(0, Math.PI, numPoints);
    const x_fine = theta.map(t => circle.centerX + circle.radius * Math.cos(t));
    const z_fine = theta.map(t => circle.centerY + circle.radius * Math.sin(t));

    // Создаем арки
    const y = linspace(0, depth, numPoints);
    const arc1 = {
        x: x_fine,
        y: Array(numPoints).fill(0), // Арка начинается с глубины 0
        z: z_fine,
        type: 'scatter3d',
        mode: 'lines',
        line: { color: 'blue', width: 5 }
    };

    const arc2 = {
        x: x_fine.map(x => -x),
        y: Array(numPoints).fill(depth), // Вторая арка находится на глубине depth
        z: z_fine,
        type: 'scatter3d',
        mode: 'lines',
        line: { color: 'blue', width: 5 }
    };

    // Масштабирование осей на основе крайних точек арок
    const allX = x_fine.concat(x_fine.map(x => -x));
    const allY = y.concat(y);
    const allZ = z_fine.concat(z_fine);

    const minX = Math.min(...allX);
    const maxX = Math.max(...allX);
    const minY = Math.min(...allY);
    const maxY = Math.max(...allY);
    const minZ = Math.min(...allZ);
    const maxZ = Math.max(...allZ);

    // Вычисление длин арок
    let arcLength1 = calculateArcLength({ x: arc1.x, y: arc1.y, z: arc1.z });
    let arcLength2 = calculateArcLength({ x: arc2.x, y: arc2.y, z: arc2.z });

    // Инициализация данных для графика
    let data = [];

    // Добавление арок на график
    data.push(arc1);
    data.push(arc2);

    // Обновление длин арок
    document.getElementById('arcLength').innerText = `Arcs length: ${(arcLength1 + arcLength2).toFixed(2)} m`;

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

    // Интеграция GeoGebra
    let ggbApplet = new GGBApplet({
        "appName": "classic",
        "width": 600,
        "height": 400,
        "showToolBar": true,
        "showAlgebraInput": true,
        "showMenuBar": true
    }, true);

    window.addEventListener("load", function () {
        ggbApplet.inject('ggbApplet');

        ggbApplet.evalCommand(`A = (${x1}, ${y1})`);
        ggbApplet.evalCommand(`B = (${x2}, ${y2})`);
        ggbApplet.evalCommand(`C = (${x3}, ${y3})`);
        ggbApplet.evalCommand(`circumcircle = Circumcircle(A, B, C)`);
    });
}

// Функция для создания линейного интервала
function linspace(start, stop, num) {
    const arr = [];
    const step = (stop - start) / (num - 1);
    for (let i = 0; i < num; i++) {
        arr.push(start + step * i);
    }
    return arr;
}
