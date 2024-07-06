import { calculateArcLength, generateSemiEllipse, calculateDiagonals, linspace, interpolateSurface } from './model-utils.js';

export function updateModel() {
    // Get values in centimeters and convert to meters
    const width = parseFloat(document.getElementById('width').value) / 100;
    const depth = parseFloat(document.getElementById('depth').value) / 100;
    const height = parseFloat(document.getElementById('height').value) / 100;

    // Calculate diagonals and their end coordinates
    const { lengths: [diagonal1, diagonal2], endCoordinates: [endCoord1, endCoord2] } = calculateDiagonals(width, depth);

    // Generate semi-ellipses for both diagonals
    const semiEllipse1 = generateSemiEllipse(diagonal1 / 2, height, 100);
    const semiEllipse2 = generateSemiEllipse(diagonal2 / 2, height, 100);

    // Check for correct initialization of arrays
    if (!semiEllipse1 || !semiEllipse1.x || !semiEllipse1.y || semiEllipse1.x.length !== 100 || semiEllipse1.y.length !== 100) {
        console.error("Error generating semiEllipse1: arrays are not defined or have incorrect length.");
        return;
    }
    if (!semiEllipse2 || !semiEllipse2.x || !semiEllipse2.y || semiEllipse2.x.length !== 100 || semiEllipse2.y.length !== 100) {
        console.error("Error generating semiEllipse2: arrays are not defined or have incorrect length.");
        return;
    }

    // Extract x and y coordinates for the semi-ellipses
    const x_fine1 = semiEllipse1.x;
    const z_fine1 = semiEllipse1.y; // Use y as z for height
    const x_fine2 = semiEllipse2.x;
    const z_fine2 = semiEllipse2.y; // Use y as z for height

    // Generate y coordinates along the depth of the tent
    const y_coords = linspace(0, depth, 100);

   const arc1 = {
    x: x_fine1,
    y: new Array(x_fine1.length).fill(0), // Начальные координаты y для arc1
    z: z_fine1,
    type: 'scatter3d',
    mode: 'lines',
    line: { color: 'blue', width: 5 }
    };
    
    const arc2 = {
        x: x_fine1.map(x => -x),
        y: new Array(x_fine1.length).fill(depth), // Конечные координаты y для arc2
        z: z_fine1,
        type: 'scatter3d',
        mode: 'lines',
        line: { color: 'blue', width: 5 }
    };
    
    const arc3 = {
        x: x_fine2,
        y: new Array(x_fine2.length).fill(depth), // Изменено на depth для крест-накрест
        z: z_fine2,
        type: 'scatter3d',
        mode: 'lines',
        line: { color: 'red', width: 5 } // Изменен цвет для различия
    };
    
    const arc4 = {
        x: x_fine2.map(x => -x),
        y: new Array(x_fine2.length).fill(0), // Изменено на 0 для крест-накрест
        z: z_fine2,
        type: 'scatter3d',
        mode: 'lines',
        line: { color: 'red', width: 5 } // Изменен цвет для различия
    };


    // Interpolate surfaces between arcs to create tent walls
    const surface1 = interpolateSurface(arc1, arc2, 100);
    const surface2 = interpolateSurface(arc3, arc4, 100);

    // Create surface traces
    const surfaceTrace1 = {
        x: surface1.x,
        y: surface1.y,
        z: surface1.z,
        type: 'surface',
        colorscale: [[0, 'cyan'], [1, 'cyan']],
        opacity: 0.3,
        showscale: false
    };

    const surfaceTrace2 = {
        x: surface2.x,
        y: surface2.y,
        z: surface2.z,
        type: 'surface',
        colorscale: [[0, 'cyan'], [1, 'cyan']],
        opacity: 0.3,
        showscale: false
    };

    // Scale axes based on arc end points
    const allX = arc1.x.concat(arc2.x, arc3.x, arc4.x);
    const allY = arc1.y.concat(arc2.y, arc3.y, arc4.y);
    const allZ = arc1.z.concat(arc2.z, arc3.z, arc4.z);

    const minX = Math.min(...allX);
    const maxX = Math.max(...allX);
    const minY = Math.min(...allY);
    const maxY = Math.max(...allY);
    const minZ = Math.min(...allZ);
    const maxZ = Math.max(...allZ);

    // Calculate arc lengths
    const arcLength1 = calculateArcLength(arc1);
    const arcLength2 = calculateArcLength(arc2);

    // Initialize graph data
    const data = [arc1, arc2, arc3, arc4, surfaceTrace1, surfaceTrace2];

    // Update arc lengths display
    document.getElementById('arcLength').innerText = `Arcs length: ${(arcLength1 + arcLength2).toFixed(2)} m`;

    // Define layout of the plot
    const layout = {
        scene: {
            xaxis: {
                title: 'Width',
                dtick: 0.1, // Grid step on X axis 10 cm
                range: [minX, maxX]
            },
            yaxis: {
                title: 'Depth',
                dtick: 0.1, // Grid step on Y axis 10 cm
                range: [minY, maxY]
            },
            zaxis: {
                title: 'Height',
                dtick: 0.1, // Grid step on Z axis 10 cm
                range: [minZ, maxZ]
            },
            aspectratio: {
                x: width / Math.max(width, depth, height),
                y: depth / Math.max(width, depth, height),
                z: height / Math.max(width, depth, height)
            },
            camera: {
                eye: {
                    x: 1.5,
                    y: 1.5,
                    z: 1.5
                },
                center: {
                    x: 0,
                    y: 0,
                    z: 0
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

    // Plot the tent model
    Plotly.newPlot('tentModel', data, layout);
}
