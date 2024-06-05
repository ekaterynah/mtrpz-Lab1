'use strict'
const fs = require('fs');
const path = require('path');

function parseMarkdown(markdown) {
    let html = '';
    const lines = markdown.split('\n');
    let inParagraph = false;
    let inPreformatted = false;

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
        if (line.startsWith('```')) {
            if (inPreformatted) {
                html += '</pre>';
                inPreformatted = false;
            } else {
                html += '<pre>';
                inPreformatted = true;
            }
            continue;
        }
        if (!inPreformatted) {
            if (!inParagraph) {
                html += '<p>';
                inParagraph = true;
            }
            line = line
                .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') // Bold
                .replace(/_(.*?)_/g, '<i>$1</i>') // Italic
                .replace(/`(.*?)`/g, '<tt>$1</tt>'); // Monospaced
        }

        html += inPreformatted ? line + '\n' : line.trim() + ' ';
    }
    return html;
}
