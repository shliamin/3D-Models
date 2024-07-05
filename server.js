// static/js/server.js

import { interpolateSurface, calculateSemiAxes, circularArc, halfCircularArc, interpolateSurfaceUntilIntersection } from './model.js';

export async function generateModel() {
    const width = parseFloat(document.getElementById('width').value);
    const depth = parseFloat(document.getElementById('depth').value);
    const height = parseFloat(document.getElementById('height').value);

    console.log('Current values for 3D Model:', { width, depth, height });

    // Calculate semi-major and semi-minor axes
    let { a, b } = calculateSemiAxes([[0, 0], [width, 0], [0, depth], [width, depth]]);

    // Update arcs to draw them correctly
    const arc1 = circularArc([0, 0], [width, depth], height, a, b);
    const arc2 = circularArc([width, 0], [0, depth], height, a, b);
    const arc3 = circularArc([0, 0], [0, depth], height, a, b);
    const arc4 = circularArc([width, 0], [width, depth], height, a, b);
    const arc5 = halfCircularArc([0, 0], [0, depth], height, a, b);
    const arc6 = halfCircularArc([width, 0], [width, depth], height, a, b);
    const arc7 = halfCircularArc([0, 0], [0, depth], height, a, b);
    const arc8 = halfCircularArc([width, 0], [width, depth], height, a, b);

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

    // Display spinner
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
        // Hide spinner
        document.getElementById('spinner').style.display = 'none';
    }
}

export async function generatePattern() {
    const width = parseFloat(document.getElementById('width').value);
    const depth = parseFloat(document.getElementById('depth').value);
    const height = parseFloat(document.getElementById('height').value);

    console.log('Current values for 2D Pattern:', { width, depth, height });

    // Calculate semi-major and semi-minor axes
    let { a, b } = calculateSemiAxes([[0, 0], [width, 0], [0, depth], [width, depth]]);

    const arc5 = halfCircularArc([0, 0], [width, depth], height, a, b);
    const arc6 = halfCircularArc([width, 0], [0, depth], height, a, b);
    const arc7 = halfCircularArc([0, 0], [width, depth], height, a, b);
    const arc8 = halfCircularArc([0, depth], [width, 0], height, a, b);

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

    // Display spinner
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
        // Hide spinner
        document.getElementById('spinner').style.display = 'none';
    }
}
