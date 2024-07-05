import { initializeGeoGebra } from './model.js';
import { generateModel } from './server.js';
import { generatePattern } from './server.js';

document.getElementById('generateModelButton').onclick = generateModel;
document.getElementById('generatePatternButton').onclick = generatePattern;

window.onload = () => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (!isMobile) {
        initializeGeoGebra();
    } else {
        document.querySelector('.mobile-message').style.display = 'block';
    }
};
