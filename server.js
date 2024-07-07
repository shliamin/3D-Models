import { generateSemiEllipse, generateHalfSemiEllipse, interpolateSurface, calculateDiagonals, linspace, findIntersection } from './model-utils.js';

export async function generateModel() {
    const width = parseFloat(document.getElementById('width').value);
    const depth = parseFloat(document.getElementById('depth').value);
    const height = parseFloat(document.getElementById('height').value);

    console.log('Current values for 3D Model:', { width, depth, height });

    const numPoints = 300;

    // Calculate diagonals and their end coordinates
    const { lengths: [diagonal1, diagonal2], endCoordinates: [endCoord1Start, endCoord1End, endCoord2Start, endCoord2End] } = calculateDiagonals(width, depth);

    // Generate semi-ellipses for both diagonals
    const semiEllipse1 = generateSemiEllipse(diagonal1 / 2, height, 300);
    const semiEllipse2 = generateSemiEllipse(diagonal2 / 2, height, 300);
    
    const x_fine1 = semiEllipse1.x;
    const z_fine1 = semiEllipse1.y;
    const x_fine2 = semiEllipse2.x;
    const z_fine2 = semiEllipse2.y;
    const y = linspace(0, depth, 300);

    // Assuming apex is the highest point of semiEllipse1
    const apex = { x: x_fine1[0], y: y[0], z: z_fine1[0] };
    
    // Create arcs
    const arc1 = {
        x: x_fine1,
        y: y,
        z: z_fine1,
        type: 'scatter3d',
        mode: 'lines',
        line: { color: 'blue', width: 5 },
        name: 'Tent Frame 1'
    };
    
    const arc2 = {
        x: x_fine1.map(x => -x),
        y: y,
        z: z_fine1,
        type: 'scatter3d',
        mode: 'lines',
        line: { color: 'blue', width: 5 },
        name: 'Tent Frame 2'
    };
    
    // Create arc3 with reversed points from arc1
    const arc3 = {
        x: [...arc1.x].reverse(),
        y: [...arc1.y].reverse(),
        z: [...arc1.z].reverse(),
        type: 'scatter3d',
        mode: 'lines',
        line: { color: 'blue', width: 5 },
        visible: false
    };

    // Interpolate surfaces
    const surface1 = interpolateSurface(arc1, arc2, 300);
    const surface2 = interpolateSurface(arc2, arc3, 300);

    //const intersection1 = findIntersection(arc1, arc3, 100)
    //const intersection2 = findIntersection(arc2, arc3, 100)

    
    const surface3 = interpolateSurface(arc1, arc2, 300, 5, true);
    const surface4 = interpolateSurface(arc2, arc3, 300, 5, true);

    const payload = {
        width,
        depth,
        height,
        surface1,
        surface2,
        surface3,
        surface4,
        enable_relaxation: true // Always enable relaxation
    };

    // Show spinner while fetching
    document.getElementById('spinner').style.display = 'block';

    try {
        const response = await fetch('https://interactive-tent-0697ab02fbe0.herokuapp.com/generate_model', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'models.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    } finally {
        // Hide spinner after fetch
        document.getElementById('spinner').style.display = 'none';
    }
}

export async function generatePattern() {
    const width = parseFloat(document.getElementById('width').value);
    const depth = parseFloat(document.getElementById('depth').value);
    const height = parseFloat(document.getElementById('height').value);

    console.log('Current values for 2D Pattern:', { width, depth, height });

    const numPoints = 300;

    // Generate half arcs using the new function
    const { lengths: [diagonal1, diagonal2] } = calculateDiagonals(width, depth);

    // Generate semi-ellipses for both diagonals
    const semiEllipse1 = generateSemiEllipse(diagonal1 / 2, height, 300);
    const semiEllipse2 = generateSemiEllipse(diagonal2 / 2, height, 300);
    
    const x_fine1 = semiEllipse1.x;
    const z_fine1 = semiEllipse1.y;
    const x_fine2 = semiEllipse2.x;
    const z_fine2 = semiEllipse2.y;
    const y = linspace(0, depth, 300);

    // Assuming apex is the highest point of semiEllipse1
    const apex = { x: x_fine1[0], y: y[0], z: z_fine1[0] };
    
    // Create arcs
    const arc1 = {
        x: x_fine1,
        y: y,
        z: z_fine1,
        type: 'scatter3d',
        mode: 'lines',
        line: { color: 'blue', width: 5 },
        name: 'Tent Frame 1'
    };
    
    const arc2 = {
        x: x_fine1.map(x => -x),
        y: y,
        z: z_fine1,
        type: 'scatter3d',
        mode: 'lines',
        line: { color: 'blue', width: 5 },
        name: 'Tent Frame 2'
    };
    
    // Create arc3 with reversed points from arc1
    const arc3 = {
        x: [...arc1.x].reverse(),
        y: [...arc1.y].reverse(),
        z: [...arc1.z].reverse(),
        type: 'scatter3d',
        mode: 'lines',
        line: { color: 'blue', width: 5 },
        visible: false
    };

    // Interpolate surfaces until intersection
    //const intersection1 = findIntersection(arc1, arc3, 100)
    //const intersection2 = findIntersection(arc2, arc3, 100)
    
    const surface3 = interpolateSurface(arc1, arc2, 300, 5, true);
    const surface4 = interpolateSurface(arc2, arc3, 300, 5, true);
    
    const payload = {
        width,
        depth,
        height,
        surface3,
        surface4,
        enable_relaxation: true // Always enable relaxation
    };

    // Show spinner while fetching
    document.getElementById('spinner').style.display = 'block';

    try {
        const response = await fetch('https://interactive-tent-0697ab02fbe0.herokuapp.com/generate_pattern', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'Patterns_and_Models.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    } finally {
        // Hide spinner after fetch
        document.getElementById('spinner').style.display = 'none';
    }
}
