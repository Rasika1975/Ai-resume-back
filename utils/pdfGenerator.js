const PDFDocument = require('pdfkit');
const fs = require('fs');

function generatePDF(text, outputPath) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();

    doc.pipe(fs.createWriteStream(outputPath));

    doc.font('Times-Roman')
      .fontSize(12)
      .text(text, {
        align: 'left'
      });

    doc.end();

    doc.on('finish', () => {
      resolve(outputPath);
    });

    doc.on('error', (err) => {
      reject(err);
    });
  });
}

module.exports = generatePDF;
