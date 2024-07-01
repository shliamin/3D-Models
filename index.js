// index.js

import { updateModel } from './model.js';
import { generateModel } from './server.js';
import { generatePattern } from './server.js';

document.getElementById('generateModelButton').onclick = generateModel;
document.getElementById('generatePatternButton').onclick = generatePattern;
document.getElementById('width').onchange = updateModel;
document.getElementById('depth').onchange = updateModel;
document.getElementById('height').onchange = updateModel;
document.getElementById('surface1').onchange = updateModel;
document.getElementById('surface2').onchange = updateModel;

// Initialize the model on page load
window.onload = updateModel;
