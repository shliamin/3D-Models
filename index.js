import { updateModel } from './model.js';
import { generateModel } from './server.js';
import { generatePattern } from './server.js';

document.addEventListener('DOMContentLoaded', () => {
    // Установка обработчиков событий после полной загрузки DOM
    document.getElementById('generateModelButton').onclick = generateModel;
    document.getElementById('generatePatternButton').onclick = generatePattern;
    document.getElementById('width').onchange = updateModel;
    document.getElementById('depth').onchange = updateModel;
    document.getElementById('height').onchange = updateModel;
    document.getElementById('surface1').onchange = updateModel;
    document.getElementById('surface2').onchange = updateModel;


    const patternForm = document.getElementById('patternForm');
    if (patternForm) {
        patternForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            await generatePattern();
        });
    }

    // Установка начальных значений модели при загрузке страницы
    window.onload = () => {
        const isMobile = window.matchMedia("(max-width: 768px)").matches;

        if (!isMobile) {
            updateModel();
        } else {
            document.querySelector('.mobile-message').style.display = 'block';
        }
    };
});
