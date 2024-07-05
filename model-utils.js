import { calculateArcLength, generateSemiEllipse, linspace } from './model-utils.js';

export function updateModel() {
    // Get values in centimeters and convert to meters
    const width = parseFloat(document.getElementById('width').value) / 100;
    const depth = parseFloat(document.getElementById('depth').value) / 100;
    const height = parseFloat(document.getElementById('height').value) / 100;

    // Validate input values
    if (isNaN(width) || isNaN(depth) || isNaN(height)) {
        console.error("Invalid input values.");
        return;
    }

    // Define parameters for creating arcs
    const y = linspace(0, depth, 100);
    const semiEllipse = generateSemiEllipse(width / 2, height, 100);
    const x_fine = semiEllipse.x;
    const z_fine = semiEllipse.y;

    // Validate arc data
    if (!Array.isArray(x_fine) || !Array.isArray(z_fine)) {
        console.error("Error in arc data.");
        return;
    }

    // Create arcs
    const arc1 = {
        x: x_fine,
        y: y,
        z: z_fine,
        type: 'scatter3d',
        mode: 'lines',
        line: { color: 'blue', width: 5 }
    };

    const arc2 = {
        x: x_fine.map(x => -x),
        y: y,
        z: z_fine,
        type: 'scatter3d',
        mode: 'lines',
        line: { color: 'blue', width: 5 }
    };

    // Scale axes based on arc end points
    const allX = arc1.x.concat(arc2.x);
    const allY = arc1.y.concat(arc2.y);
    const allZ = arc1.z.concat(arc2.z);

    const minX = Math.min(...allX);
    const maxX = Math.max(...allX);
    const minY = Math.min(...allY);
    const maxY = Math.max(...allY);
    const minZ = Math.min(...allZ);
    const maxZ = Math.max(...allZ);

    // Calculate arc lengths
    let arcLength1 = calculateArcLength({ x: arc1.x, y: arc1.y, z: arc1.z });
    let arcLength2 = calculateArcLength({ x: arc2.x, y: arc2.y, z: arc2.z });

    // Initialize graph data
    let data = [];

    // Add arcs to graph
    data.push(arc1);
    data.push(arc2);

    // Update arc lengths
    document.getElementById('arcLength').innerText = `Arcs length: ${(arcLength1 + arcLength2).toFixed(2)} m`;

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
                x: width / Math.max(width, depth, height),
                y: depth / Math.max(width, depth, height),
                z: height / Math.max(width, depth, height)
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


// Function to calculate the diagonals of the base
export function calculateDiagonals(length, depth) {
    const diagonal1 = Math.sqrt(Math.pow(length, 2) + Math.pow(depth, 2));
    const diagonal2 = diagonal1; // Assuming both diagonals are equal for a rectangular base
    return [diagonal1, diagonal2];
}
