const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('s:/NESAm-app/Docs/NESAm-ER v2.pdf');

pdf(dataBuffer).then(function(data) {
    fs.writeFileSync('s:/NESAm-app/Docs/nesam_er_v2.txt', data.text);
    console.log("PDF parsed and saved.");
});
