import { calculateArcLength, generateSemiEllipse, calculateDiagonals, linspace } from './model-utils.js';

export function updateModel() {
    // Convert values from centimeters to meters
    const width = parseFloat(document.getElementById('width').value) / 100;
    const depth = parseFloat(document.getElementById('depth').value) / 100;
    const height = parseFloat(document.getElementById('height').value) / 100;

    // Validate input values
    if (isNaN(length) || isNaN(depth) || isNaN(height)) {
        console.error("Invalid input values.");
        return;
    }

    // Calculate the diagonals
    const [diagonal1, diagonal2] = calculateDiagonals(length, depth);

    // Generate semi-ellipses for both diagonals
    const semiEllipse1 = generateSemiEllipse(diagonal1 / 2, height, 100);
    const semiEllipse2 = generateSemiEllipse(diagonal2 / 2, height, 100);
    
    const x_fine1 = semiEllipse1.x;
    const z_fine1 = semiEllipse1.y;
    const x_fine2 = semiEllipse2.x;
    const z_fine2 = semiEllipse2.y;
    const y = linspace(0, depth, 100);

    // Validate arc data
    if (!Array.isArray(x_fine1) || !Array.isArray(z_fine1) || !Array.isArray(x_fine2) || !Array.isArray(z_fine2) || !Array.isArray(y)) {
        console.error("Error in arc data.");
        return;
    }

    // Create arcs
    const arc1 = {
        x: x_fine1,
        y: y,
        z: z_fine1,
        type: 'scatter3d',
        mode: 'lines',
        line: { color: 'blue', width: 5 }
    };

    const arc2 = {
        x: x_fine1.map(x => -x),
        y: y,
        z: z_fine1,
        type: 'scatter3d',
        mode: 'lines',
        line: { color: 'blue', width: 5 }
    };

    const arc3 = {
        x: x_fine2,
        y: y,
        z: z_fine2,
        type: 'scatter3d',
        mode: 'lines',
        line: { color: 'green', width: 5 }
    };

    const arc4 = {
        x: x_fine2.map(x => -x),
        y: y,
        z: z_fine2,
        type: 'scatter3d',
        mode: 'lines',
        line: { color: 'green', width: 5 }
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
    let arcLength1 = calculateArcLength({ x: arc1.x, y: arc1.y, z: arc1.z });
    let arcLength2 = calculateArcLength({ x: arc2.x, y: arc2.y, z: arc2.z });
    let arcLength3 = calculateArcLength({ x: arc3.x, y: arc3.y, z: arc3.z });
    let arcLength4 = calculateArcLength({ x: arc4.x, y: arc4.y, z: arc4.z });

    // Initialize graph data
    let data = [];

    // Add arcs to graph
    data.push(arc1);
    data.push(arc2);
    data.push(arc3);
    data.push(arc4);

    // Update arc lengths
    document.getElementById('arcLength').innerText = `Arcs length: ${(arcLength1 + arcLength2 + arcLength3 + arcLength4).toFixed(2)} m`;

    let layout = {
        scene: {
            xaxis: {
                title: 'Width',
                dtick: 0.1, // Grid step on X axis 10 cm
                range: [minX, maxX]
            },
            yaxis: {
                title: 'Depth',
                dtick: 0.1, // Grid step on Y axis 10 cm
                range: [0, depth]
            },
            zaxis: {
                title: 'Height',
                dtick: 0.1, // Grid step on Z axis 10 cm
                range: [minZ, maxZ]
            },
            aspectratio: {
                x: length / Math.max(length, depth, height),
                y: depth / Math.max(length, depth, height),
                z: height / Math.max(length, depth, height)
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
