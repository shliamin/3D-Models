import {
    linspace,
    calculateArcLength,
    calculateSurfaceArea,
    findIntersection,
    interpolateSurface,
    perfectArc,
    halfPerfectArc,
    interpolateSurfaceUntilIntersection
} from './model-utils.js';

export function updateModel() {
    // Get values in centimeters and convert to meters
    const width = parseFloat(document.getElementById('width').value) / 100;
    const depth = parseFloat(document.getElementById('depth').value) / 100;
    const height = parseFloat(document.getElementById('height').value) / 100;

    // Create a canvas and set its context
    var canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 500;
    var context = canvas.getContext('2d', { willReadFrequently: true });

    // Drawing on the canvas
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
        [0, 0, 0], // Bottom front left corner
        [width, 0, 0], // Bottom front right corner
        [0, depth, 0], // Bottom back left corner
        [width, depth, 0], // Bottom back right corner
        [width / 2, depth / 2, height] // Top center point
    ];

    // Draw arcs intersecting at the tent's top vertex
    let arcs = [
        perfectArc(vertices[0], vertices[4], height),
        perfectArc(vertices[1], vertices[4], height),
        perfectArc(vertices[2], vertices[4], height),
        perfectArc(vertices[3], vertices[4], height)
    ];

    // Interpolate to create surface points between arcs
    let surfaces = [
        interpolateSurface(arcs[0], arcs[1]),
        interpolateSurface(arcs[2], arcs[3])
    ];

    // Calculate surface areas
    let surfaceAreas = surfaces.map(surface => calculateSurfaceArea(surface));

    // Calculate arc lengths
    let arcLengths = arcs.map(arc => calculateArcLength(arc));

    // Initialize total area
    let totalArea = 0;

    // Prepare data for Plotly
    let data = [];
    if (document.getElementById('surface1').checked) {
        totalArea += surfaceAreas[0];
        data.push(createSurfaceData(surfaces[0], 'rgba(0, 255, 255, 0.3)'));
    }
    if (document.getElementById('surface2').checked) {
        totalArea += surfaceAreas[1];
        data.push(createSurfaceData(surfaces[1], 'rgba(255, 0, 0, 0.3)'));
    }

    // Update total surface area and arc lengths
    document.getElementById('surfaceArea').innerText = `Surface area: ${totalArea.toFixed(2)} m²`;
    document.getElementById('arcLength').innerText = `Arcs length: ${arcLengths.reduce((sum, len) => sum + len, 0).toFixed(2)} m`;

    // Add arcs and edges
    arcs.forEach(arc => {
        data.push(createArcData(arc, 'blue'));
    });
    data.push(createEdgeData(vertices));

    // Determine axis ranges
    let [allX, allY, allZ] = [[], [], []];
    arcs.forEach(arc => {
        allX.push(...arc.x);
        allY.push(...arc.y);
        allZ.push(...arc.z);
    });

    let minX = Math.min(...allX);
    let maxX = Math.max(...allX);
    let minY = Math.min(...allY);
    let maxY = Math.max(...allY);
    let minZ = Math.min(...allZ);
    let maxZ = Math.max(...allZ);

    // Define layout
    let layout = createLayout(minX, maxX, minY, maxY, minZ, maxZ, width, depth, height);

    // Plot using Plotly
    Plotly.newPlot('tentModel', data, layout);
}

function createSurfaceData(surface, color) {
    return {
        x: surface.x,
        y: surface.y,
        z: surface.z,
        type: 'surface',
        colorscale: [[0, color], [1, color]],
        opacity: 0.7,
        showscale: false
    };
}

function createArcData(arc, color) {
    return {
        x: arc.x,
        y: arc.y,
        z: arc.z,
        mode: 'lines',
        line: {
            color: color,
            width: 5
        },
        type: 'scatter3d'
    };
}

function createEdgeData(vertices) {
    return {
        x: [vertices[0][0], vertices[1][0], vertices[3][0], vertices[2][0], vertices[0][0]],
        y: [vertices[0][1], vertices[1][1], vertices[3][1], vertices[2][1], vertices[0][1]],
        z: [vertices[0][2], vertices[1][2], vertices[3][2], vertices[2][2], vertices[0][2]],
        mode: 'lines',
        line: {
            color: 'blue',
            width: 5
        },
        type: 'scatter3d'
    };
}

function createLayout(minX, maxX, minY, maxY, minZ, maxZ, width, depth, height) {
    return {
        scene: {
            xaxis: {
                title: 'Width',
                range: [minX, maxX],
                dtick: 10
            },
            yaxis: {
                title: 'Depth',
                range: [minY, maxY],
                dtick: 10
            },
            zaxis: {
                title: 'Height',
                range: [minZ, maxZ],
                dtick: 10
            },
            aspectratio: { x: width, y: depth, z: height },
            camera: {
                eye: {
                    x: 1.5,
                    y: 1,
                    z: 2
                },
                center: {
                    x: 0.5,
                    y: 0,
                    z: -0.2
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
}
