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

function main() {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.error('Error: No input file specified');
        process.exit(1);
    }

    const inputFilePath = args[0];
    const outputFlagIndex = args.indexOf('--out');
    let outputFilePath = null;

    if (outputFlagIndex !== -1) {
        if (outputFlagIndex + 1 >= args.length) {
            console.error('Error: No output file specified');
            process.exit(1);
        }
        outputFilePath = args[outputFlagIndex + 1];
    }

    fs.readFile(inputFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error: Unable to read file ${inputFilePath}`);
            process.exit(1);
        }

        let html;
        try {
            html = parseMarkdown(data);
        } catch (err) {
            console.error(`Error: invalid markdown: ${err.message}`);
            process.exit(1);
        }

        if (outputFilePath) {
            fs.writeFile(outputFilePath, html, (err) => {
                if (err) {
                    console.error(`Error: Unable to write to file ${outputFilePath}`);
                    process.exit(1);
                }
            });
        } else {
            console.log(html);
        }
    });
}

main();
