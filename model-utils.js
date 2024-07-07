import { calculateArcLength, calculateSurfaceArea, generateSemiEllipse, calculateDiagonals, linspace, interpolateSurface } from './model-utils.js';

export function updateModel() {
    // Convert values from centimeters to meters
    const width = parseFloat(document.getElementById('width').value) / 100;
    const depth = parseFloat(document.getElementById('depth').value) / 100;
    const height = parseFloat(document.getElementById('height').value) / 100;

    // Calculate diagonals and their end coordinates
    const { lengths: [diagonal1, diagonal2], endCoordinates: [endCoord1Start, endCoord1End, endCoord2Start, endCoord2End] } = calculateDiagonals(width, depth);

    // Generate semi-ellipses for both diagonals
    const semiEllipse1 = generateSemiEllipse(diagonal1 / 2, height, 100); // Reduced to 100 points
    const semiEllipse2 = generateSemiEllipse(diagonal2 / 2, height, 100); // Reduced to 100 points

    const x_fine1 = semiEllipse1.x;
    const z_fine1 = semiEllipse1.y;
    const x_fine2 = semiEllipse2.x;
    const z_fine2 = semiEllipse2.y;
    const y = linspace(0, depth, 100); // Reduced to 100 points

    // Validate arc data
    if (!Array.isArray(x_fine1) || !Array.isArray(z_fine1) || !Array.isArray(x_fine2) || !Array.isArray(z_fine2) || !Array.isArray(y)) {
        console.error("Error in arc data.");
        return;
    }

    // Calculate min values for shifting coordinates
    const minX = Math.min(...x_fine1, ...x_fine2.map(x => -x));
    const minY = Math.min(...y);
    const minZ = Math.min(...z_fine1, ...z_fine2);

    // Shift all coordinates to be positive
    const shiftX = -minX;
    const shiftY = -minY;
    const shiftZ = -minZ;

    const arc1 = {
        x: x_fine1.map(x => x + shiftX),
        y: y.map(y => y + shiftY),
        z: z_fine1.map(z => z + shiftZ),
        type: 'scatter3d',
        mode: 'lines',
        line: { color: 'blue', width: 5 },
        name: 'Tent Frame 1'
    };

    const arc2 = {
        x: x_fine2.map(x => -x + shiftX),
        y: y.map(y => y + shiftY),
        z: z_fine2.map(z => z + shiftZ),
        type: 'scatter3d',
        mode: 'lines',
        line: { color: 'blue', width: 5 },
        name: 'Tent Frame 2'
    };

    const arc3 = {
        x: [...arc1.x].reverse(),
        y: [...arc1.y].reverse(),
        z: [...arc1.z].reverse(),
        type: 'scatter3d',
        mode: 'lines',
        line: { color: 'blue', width: 5 },
        visible: false
    };

    // Interpolate surface using shifted coordinates
    const surface1 = interpolateSurface(arc1, arc2, 100); // Reduced to 100 points
    const surface2 = interpolateSurface(arc2, arc3, 100); // Reduced to 100 points

    // Check the state of the checkboxes
    const showSurface1 = document.getElementById('surface1').checked;
    const showSurface2 = document.getElementById('surface2').checked;

    // Create surface trace with shifted coordinates
    const surfaceTrace1 = {
        x: surface1.x,
        y: surface1.y,
        z: surface1.z,
        type: 'surface',
        colorscale: [[0, 'cyan'], [1, 'cyan']],
        opacity: 0.2,
        showscale: false,
        name: 'Tent Wall 1',
        visible: showSurface1
    };

    const surfaceTrace2 = {
        x: surface2.x,
        y: surface2.y,
        z: surface2.z,
        type: 'surface',
        colorscale: [[0, 'cyan'], [1, 'cyan']],
        opacity: 0.2,
        showscale: false,
        name: 'Tent Wall 2',
        visible: showSurface2
    };

    // Scale axes based on arc end points
    const allX = arc1.x.concat(arc2.x);
    const allY = arc1.y.concat(arc2.y);
    const allZ = arc1.z.concat(arc2.z);

    const maxX = Math.max(...allX);
    const maxY = Math.max(...allY);
    const maxZ = Math.max(...allZ);

    // Calculate arc lengths
    let arcLength1 = calculateArcLength(arc1);
    let arcLength2 = calculateArcLength(arc2);

    // Calculate surface areas only for visible surfaces
    let surfaceArea1 = showSurface1 ? calculateSurfaceArea(surface1) : 0;
    let surfaceArea2 = showSurface2 ? calculateSurfaceArea(surface2) : 0;

    // Initialize graph data
    let data = [];

    // Add arcs and surface to graph
    data.push(arc1);
    data.push(arc2);
    data.push(arc3);
    if (showSurface1) data.push(surfaceTrace1);
    if (showSurface2) data.push(surfaceTrace2);

    // Update arc lengths and surface areas
    document.getElementById('arcLength').innerText = `Arcs length: ${(arcLength1 + arcLength2).toFixed(2)} m`;
    document.getElementById('surfaceArea').innerText = `Surface areas: ${(surfaceArea1 + surfaceArea2).toFixed(2)} m²`;

    let layout = {
        scene: {
            xaxis: {
                title: 'Width',
                dtick: 0.1, // Grid step on X axis 10 cm
                range: [0, maxX]
            },
            yaxis: {
                title: 'Depth',
                dtick: 0.1, // Grid step on Y axis 10 cm
                range: [0, maxY]
            },
            zaxis: {
                title: 'Height',
                dtick: 0.1, // Grid step on Z axis 10 cm
                range: [0, maxZ]
            },
            aspectratio: {
                x: width / Math.max(width, depth, height),
                y: depth / Math.max(width, depth, height),
                z: height / Math.max(width, depth, height)
            },
            camera: {
                eye: {
                    x: 1.5,
                    y: 0.5,
                    z: 0.75
                },
                center: {
                    x: 0,
                    y: 0,
                    z: 0
                }
            }
        },
        legend: {
            x: 1.1, // Move legend to the right of the plot
            y: 0.1,
            traceorder: 'normal',
            font: {
                family: 'Arial, sans-serif',
                size: 12,
                color: 'black'
            },
            bgcolor: 'rgba(255, 255, 255, 0.5)',
            bordercolor: 'rgba(255, 255, 255, 0)', // Make border invisible
            borderwidth: 0
        },
        annotations: [
            {
                showarrow: false,
                text: "<b>👈 The Perfect Tent Shape </b>",
                x: 1, // Position text to the right of the plot
                y: 0.5,
                font: {
                    family: "Arial, sans-serif",
                    size: 14,
                    color: "black"
                },
                xref: 'paper',
                yref: 'paper',
                align: 'left',
                xanchor: 'left',
                yanchor: 'middle'
            }
        ],
        margin: {
            l: 0,
            r: 200, // Add more space for annotations
            b: 0,
            t: 0
        }
    };

    // Update the graph with annotations and legend
    Plotly.newPlot('tentModel', data, layout);
}
