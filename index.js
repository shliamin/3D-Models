// index.js

import { updateModel } from './model.js';
import { generateModel } from './server.js';

document.getElementById('generateModelButton').onclick = generateModel;


window.onload = updateModel;
