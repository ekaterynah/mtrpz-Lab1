'use strict'

function parseMarkdown(markdown) {
    let html = '';
    const lines = markdown.split('\n');
    let inParagraph = false;

    for (let line of lines) {
        if (line.trim() === '') {
            if (inParagraph) {
                html += '</p>';
                inParagraph = false;
            } else {
                html += '<p>';
                inParagraph = true;
            }
            continue;
        }
    }
}