import { linspace, calculateArcLength, createArc, createHalfArc } from './model-utils.js';

// model.js

export function updateModel() {
    const width = parseFloat(document.getElementById('width').value) / 100;
    const depth = parseFloat(document.getElementById('depth').value) / 100;
    const height = parseFloat(document.getElementById('height').value) / 100;

    const { arc1, arc2 } = createArcs(width, depth, height);

    const allX = arc1.x.concat(arc2.x);
    const allY = arc1.y.concat(arc2.y);
    const allZ = arc1.z.concat(arc2.z);

    const maxX = Math.max(...allX);
    const maxY = Math.max(...allY);
    const maxZ = Math.max(...allZ);

    let arcLength1 = calculateArcLength({ x: arc1.x, y: arc1.y, z: arc1.z });
    let arcLength2 = calculateArcLength({ x: arc2.x, y: arc2.y, z: arc2.z });

    let data = [arc1, arc2];

    document.getElementById('arcLength').innerText = `Arcs length: ${(arcLength1 + arcLength2).toFixed(2)} m`;

    let layout = {
        scene: {
            xaxis: {
                title: 'Width',
                dtick: 0.1,
                range: [0, maxX]
            },
            yaxis: {
                title: 'Depth',
                dtick: 0.1,
                range: [0, maxY]
            },
            zaxis: {
                title: 'Height',
                dtick: 0.1,
                range: [0, maxZ]
            },
            aspectratio: {
                x: width / Math.max(width, depth, height),
                y: depth / Math.max(width, depth, height),
                z: height / Math.max(width, depth, height)
            },
            camera: {
                eye: {
                    x: 2,
                    y: 1,
                    z: 2
                },
                center: {
                    x: 0.5,
                    y: 0,
                    z: 0.1
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
