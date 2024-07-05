import { linspace, calculateArcLength, calculateSurfaceArea, findIntersection, interpolateSurface, perfectArc, halfPerfectArc, interpolateSurfaceUntilIntersection } from './model-utils.js';

// model.js

export function updateModel() {
    // Get values in centimeters and convert to meters
    const width = parseFloat(document.getElementById('width').value) / 100;
    const depth = parseFloat(document.getElementById('depth').value) / 100;
    const height = parseFloat(document.getElementById('height').value) / 100;

    // Tent vertices coordinates
    let vertices = [
        [0, 0, 0],         // Bottom front left corner
        [width, 0, 0],     // Bottom front right corner
        [0, depth, 0],     // Bottom back left corner
        [width, depth, 0], // Bottom back right corner
        [width / 2, depth / 2, height]  // Top center point
    ];

    // Draw arcs intersecting at the tent's top vertex
    let arc1 = perfectArc(vertices[0], vertices[3], height);
    let arc2 = perfectArc(vertices[1], vertices[2], height);

    // Interpolate to create surface points between arcs
    let surface1 = interpolateSurface(arc1, arc2);

    // Calculate surface areas
    let area1 = calculateSurfaceArea(surface1);

    // Calculate arc lengths
    let arcLength1 = calculateArcLength(arc1);
    let arcLength2 = calculateArcLength(arc2);

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

    // Update total surface area and arc lengths
    document.getElementById('surfaceArea').innerText = `Surface area: ${totalArea.toFixed(2)} m²`;
    document.getElementById('arcLength').innerText = `Arcs length: ${(arcLength1 + arcLength2).toFixed(2)} m`;

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

    // Add edges of the tent base
    data.push({
        x: [vertices[0][0], vertices[1][0]],
        y: [vertices[0][1], vertices[1][1]],
        z: [vertices[0][2], vertices[1][2]],
        mode: 'lines',
        line: {
            color: 'red',
            width: 5
        },
        type: 'scatter3d'
    });

    data.push({
        x: [vertices[0][0], vertices[2][0]],
        y: [vertices[0][1], vertices[2][1]],
        z: [vertices[0][2], vertices[2][2]],
        mode: 'lines',
        line: {
            color: 'blue',
            width: 5
        },
        type: 'scatter3d'
    });

    data.push({
        x: [vertices[2][0], vertices[3][0]],
        y: [vertices[2][1], vertices[3][1]],
        z: [vertices[2][2], vertices[3][2]],
        mode: 'lines',
        line: {
            color: 'green',
            width: 5
        },
        type: 'scatter3d'
    });

    data.push({
        x: [vertices[3][0], vertices[1][0]],
        y: [vertices[3][1], vertices[1][1]],
        z: [vertices[3][2], vertices[1][2]],
        mode: 'lines',
        line: {
            color: 'yellow',
            width: 5
        },
        type: 'scatter3d'
    });

    // Adding grid lines
    const gridSize = 0.1;
    const gridLines = [];
    for (let i = 0; i <= width; i += gridSize) {
        gridLines.push({
            x: [i, i],
            y: [0, depth],
            z: [0, 0],
            mode: 'lines',
            line: { color: 'gray', width: 1 },
            type: 'scatter3d'
        });
        gridLines.push({
            x: [i, i],
            y: [0, 0],
            z: [0, height],
            mode: 'lines',
            line: { color: 'gray', width: 1 },
            type: 'scatter3d'
        });
    }
    for (let j = 0; j <= depth; j += gridSize) {
        gridLines.push({
            x: [0, width],
            y: [j, j],
            z: [0, 0],
            mode: 'lines',
            line: { color: 'gray', width: 1 },
            type: 'scatter3d'
        });
        gridLines.push({
            x: [0, 0],
            y: [j, j],
            z: [0, height],
            mode: 'lines',
            line: { color: 'gray', width: 1 },
            type: 'scatter3d'
        });
    }
    for (let k = 0; k <= height; k += gridSize) {
        gridLines.push({
            x: [0, width],
            y: [0, 0],
            z: [k, k],
            mode: 'lines',
            line: { color: 'gray', width: 1 },
            type: 'scatter3d'
        });
        gridLines.push({
            x: [0, 0],
            y: [0, depth],
            z: [k, k],
            mode: 'lines',
            line: { color: 'gray', width: 1 },
            type: 'scatter3d'
        });
    }
    data = data.concat(gridLines);

    let layout = {
        scene: {
            xaxis: {
                title: 'Width',
                dtick: 0.1, // Grid step size for X axis (10 cm)
                range: [0, Math.max(width, depth, height)]
            },
            yaxis: {
                title: 'Depth',
                dtick: 0.1, // Grid step size for Y axis (10 cm)
                range: [0, Math.max(width, depth, height)]
            },
            zaxis: {
                title: 'Height',
                dtick: 0.1, // Grid step size for Z axis (10 cm)
                range: [0, Math.max(width, depth, height)]
            },
            aspectratio: {
                x: 1, // Fixed values for aspect ratio
                y: 1,
                z: 1
            },
            camera: {
                eye: {
                    x: 2, // Adjust these values to zoom out the camera
                    y: 1,
                    z: 2
                },
                center: {
                    x: 0.5, // Shift right (positive value)
                    y: 0,
                    z: 0.1 // Shift down (negative value)
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
