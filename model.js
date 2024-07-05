import { linspace, calculateArcLength, calculateSurfaceArea, findIntersection, interpolateSurface, perfectArc, halfPerfectArc, interpolateSurfaceUntilIntersection } from './model-utils.js';

// model.js

export function updateModel() {
    // Get values in centimeters and convert to meters
    const width = parseFloat(document.getElementById('width').value) / 100;
    const depth = parseFloat(document.getElementById('depth').value) / 100;
    const height = parseFloat(document.getElementById('height').value) / 100;

    var canvas = document.createElement('canvas');
    canvas.width = '100%';
    canvas.height = '100%';
    var context = canvas.getContext('2d', { willReadFrequently: true });

    // Drawing something on the canvas
    context.fillStyle = 'lightblue';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = 'red';
    context.beginPath();
    context.arc(250, 250, 100, 0, Math.PI * 2, true);
    context.fill();

    // Adding canvas to the DOM
    document.body.appendChild(canvas);

    // Tent vertices coordinates
let vertices = [
    [0, 0, 0],         // Bottom front left corner
    [width, 0, 0],     // Bottom front right corner
    [0, depth, 0],     // Bottom back left corner
    [width, depth, 0], // Bottom back right corner
    [width / 2, depth / 2, height]  // Top center point
];

// Draw arcs intersecting at the tent's top vertex
let arc1 = perfectArc(vertices[0], vertices[4], height);
let arc2 = perfectArc(vertices[1], vertices[4], height);
let arc3 = perfectArc(vertices[2], vertices[4], height);
let arc4 = perfectArc(vertices[3], vertices[4], height);

// Interpolate to create surface points between arcs
let surface1 = interpolateSurface(arc1, arc2);
let surface2 = interpolateSurface(arc3, arc4);

// Calculate surface areas
let area1 = calculateSurfaceArea(surface1);
let area2 = calculateSurfaceArea(surface2);

// Calculate arc lengths
let arcLength1 = calculateArcLength(arc1);
let arcLength2 = calculateArcLength(arc2);
let arcLength3 = calculateArcLength(arc3);
let arcLength4 = calculateArcLength(arc4);

// Initialize total area
let totalArea = 0;

// Check which surfaces are enabled
let data = [];
if (document.getElementById('surface1').checked) {
    totalArea += area1;
    data.push({
        x: surface1.x,
        y: surface1.y,
        z: surface1.z,
        type: 'surface',
        colorscale: [[0, 'rgba(0, 255, 255, 0.3)'], [1, 'rgba(0, 255, 255, 0.3)']],
        opacity: 0.7,
        showscale: false
    });
}
if (document.getElementById('surface2').checked) {
    totalArea += area2;
    data.push({
        x: surface2.x,
        y: surface2.y,
        z: surface2.z,
        type: 'surface',
        colorscale: [[0, 'rgba(255, 0, 0, 0.3)'], [1, 'rgba(255, 0, 0, 0.3)']],
        opacity: 0.7,
        showscale: false
    });
}

// Update total surface area and arc lengths
document.getElementById('surfaceArea').innerText = `Surface area: ${totalArea.toFixed(2)} m²`;
document.getElementById('arcLength').innerText = `Arcs length: ${(arcLength1 + arcLength2 + arcLength3 + arcLength4).toFixed(2)} m`;

// Add arcs and edges
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
data.push({
    x: arc3.x,
    y: arc3.y,
    z: arc3.z,
    mode: 'lines',
    line: {
        color: 'blue',
        width: 5
    },
    type: 'scatter3d'
});
data.push({
    x: arc4.x,
    y: arc4.y,
    z: arc4.z,
    mode: 'lines',
    line: {
        color: 'blue',
        width: 5
    },
    type: 'scatter3d'
});
data.push({
    x: [vertices[0][0], vertices[1][0], vertices[3][0], vertices[2][0], vertices[0][0]],
    y: [vertices[0][1], vertices[1][1], vertices[3][1], vertices[2][1], vertices[0][1]],
    z: [vertices[0][2], vertices[1][2], vertices[3][2], vertices[2][2], vertices[0][2]],
    mode: 'lines',
    line: {
        color: 'blue',
        width: 5
    },
    type: 'scatter3d'
});

let layout = {
    scene: {
        xaxis: {
            title: 'Width',
            dtick: 0.1  // Grid step for X axis 10 cm
            tickvals: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0], 
            ticktext: ['0', '10', '20', '30', '40', '50', '60', '70', '80', '90', '100'] 
        },
        yaxis: {
            title: 'Depth',
            dtick: 0.1  // Grid step for Y axis 10 cm
            tickvals: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0], 
            ticktext: ['0', '10', '20', '30', '40', '50', '60', '70', '80', '90', '100'] 
        },
        zaxis: {
            title: 'Height',
            dtick: 0.1  // Grid step for Z axis 10 cm
            tickvals: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0], 
            ticktext: ['0', '10', '20', '30', '40', '50', '60', '70', '80', '90', '100'] 
        },
        aspectratio: { x: width, y: depth, z: height },
        camera: {
            eye: {
                x: 2, // Adjust these values to zoom out
                y: 1,
                z: 2
            },
            center: {
                x: 0.5,  // Move right (positive value)
                y: 0,
                z: 0.1 // Move down (negative value)
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


