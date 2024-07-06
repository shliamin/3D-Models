import { generateSemiEllipse, generateHalfSemiEllipse, interpolateSurface, interpolateSurfaceUntilIntersection, calculateDiagonals } from './model-utils.js';

export async function generateModel() {
    const width = parseFloat(document.getElementById('width').value);
    const depth = parseFloat(document.getElementById('depth').value);
    const height = parseFloat(document.getElementById('height').value);

    console.log('Current values for 3D Model:', { width, depth, height });

    const numPoints = 100;

    // Generate arcs using the new functions
    const { lengths: [diagonal1, diagonal2] } = calculateDiagonals(width, depth);

    const arc1 = generateSemiEllipse(diagonal1 / 2, height, numPoints);
    const arc2 = generateSemiEllipse(diagonal2 / 2, height, numPoints);
    const arc3 = generateSemiEllipse(diagonal1 / 2, height, numPoints);
    const arc4 = generateSemiEllipse(diagonal2 / 2, height, numPoints);
    const arc5 = generateHalfSemiEllipse(diagonal1 / 2, height, numPoints);
    const arc6 = generateHalfSemiEllipse(diagonal2 / 2, height, numPoints);
    const arc7 = generateHalfSemiEllipse(diagonal1 / 2, height, numPoints);
    const arc8 = generateHalfSemiEllipse(diagonal2 / 2, height, numPoints);

    // Interpolate surfaces
    const surface1 = interpolateSurface(arc1, arc2);
    const surface2 = interpolateSurface(arc3, arc4);
    const surface3 = interpolateSurfaceUntilIntersection(arc5, arc6);
    const surface4 = interpolateSurfaceUntilIntersection(arc7, arc8);

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
        const response = await fetch('https://interactive-tent-0697ab02fbe0.herokuapp.com/generate', {
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

    const numPoints = 100;

    // Generate half arcs using the new function
    const { lengths: [diagonal1, diagonal2] } = calculateDiagonals(width, depth);

    const arc5 = generateHalfSemiEllipse(diagonal1 / 2, height, numPoints);
    const arc6 = generateHalfSemiEllipse(diagonal2 / 2, height, numPoints);
    const arc7 = generateHalfSemiEllipse(diagonal1 / 2, height, numPoints);
    const arc8 = generateHalfSemiEllipse(diagonal2 / 2, height, numPoints);

    // Interpolate surfaces until intersection
    const surface3 = interpolateSurfaceUntilIntersection(arc5, arc6);
    const surface4 = interpolateSurfaceUntilIntersection(arc7, arc8);

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
