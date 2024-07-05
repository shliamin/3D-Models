import { calculateArcLength } from './model-utils.js';

let ggbApplet;

function initializeGeoGebra() {
    ggbApplet = new GGBApplet({
        "appName": "classic3d",
        "width": 100%,
        "height": 600,
        "showToolBar": true,
        "showAlgebraInput": true,
        "showMenuBar": true
    }, true);

    ggbApplet.inject('ggbApplet', 'preferHTML5', function() {
        // После того, как апплет полностью загружен
        updateModel();
    });
}

function linspace(start, stop, num) {
    const arr = [];
    const step = (stop - start) / (num - 1);
    for (let i = 0; i < num; i++) {
        arr.push(start + step * i);
    }
    return arr;
}

function circumcircle(x1, y1, x2, y2, x3, y3) {
    let midAB = [(x1 + x2) / 2, (y1 + y2) / 2];
    let midBC = [(x2 + x3) / 2, (y2 + y3) / 2];
    let slopeAB = -(x2 - x1) / (y2 - y1);
    let slopeBC = -(x3 - x2) / (y3 - y2);
    let centerX = (slopeAB * midAB[0] - slopeBC * midBC[0] + midBC[1] - midAB[1]) / (slopeAB - slopeBC);
    let centerY = slopeAB * (centerX - midAB[0]) + midAB[1];
    let radius = Math.sqrt((centerX - x1) ** 2 + (centerY - y1) ** 2);
    return { centerX, centerY, radius };
}

export function updateModel() {
    if (!ggbApplet) return; // Проверяем, что апплет загружен

    const width = parseFloat(document.getElementById('width').value) / 100;
    const depth = parseFloat(document.getElementById('depth').value) / 100;
    const height = parseFloat(document.getElementById('height').value) / 100;
    const x1 = -width / 2, y1 = 0;
    const x2 = width / 2, y2 = 0;
    const x3 = 0, y3 = height;
    const circle = circumcircle(x1, y1, x2, y2, x3, y3);
    const numPoints = 100;
    const theta = linspace(0, Math.PI, numPoints);
    const x_fine = theta.map(t => circle.centerX + circle.radius * Math.cos(t));
    const z_fine = theta.map(t => circle.centerY + circle.radius * Math.sin(t));
    const y = linspace(0, depth, numPoints);

    // Очищаем предыдущее содержимое апплета
    ggbApplet.evalCommand('Delete(A)');
    ggbApplet.evalCommand('Delete(B)');
    ggbApplet.evalCommand('Delete(C)');
    ggbApplet.evalCommand('Delete(circumcircle)');

    ggbApplet.evalCommand(`A = (${x1}, ${y1}, 0)`);
    ggbApplet.evalCommand(`B = (${x2}, ${y2}, 0)`);
    ggbApplet.evalCommand(`C = (${x3}, ${y3}, 0)`);
    ggbApplet.evalCommand(`circumcircle = Circle(A, B, C)`);
}

window.addEventListener("load", initializeGeoGebra);

// Вызов функции для обновления модели
document.getElementById('width').addEventListener('input', updateModel);
document.getElementById('depth').addEventListener('input', updateModel);
document.getElementById('height').addEventListener('input', updateModel);
