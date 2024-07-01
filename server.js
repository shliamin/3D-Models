// server.js

import { interpolateSurface, circularArc } from './model.js';

export async function generateModel() {
    const width = parseFloat(document.getElementById('width').value);
    const depth = parseFloat(document.getElementById('depth').value);
    const height = parseFloat(document.getElementById('height').value);

    // Всегда генерируем данные для surface1 и surface2
    const surface1 = interpolateSurface(circularArc([0, 0], [width, depth], height), circularArc([width, 0], [0, depth], height));
    const surface2 = interpolateSurface(circularArc([0, 0], [width, depth], height), circularArc([0, depth], [width, 0], height));

    const payload = {
        surface1,
        surface2
    };

    try {
        const response = await fetch('http://127.0.0.1:5001/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Create a link element to download the file
        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'tent.obj';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}
