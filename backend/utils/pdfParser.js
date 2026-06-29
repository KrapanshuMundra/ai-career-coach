import PDFParser from "pdf2json";

export const parsePdf = (pdfBuffer) => {
  return new Promise((resolve, reject) => {
    // FIX: Replaced 'this' with 'null' so it doesn't crash inside the arrow function
    const pdfParser = new PDFParser(null, 1);

    pdfParser.on("pdfParser_dataError", errData => {
      console.error("PDF Parsing Error:", errData.parserError);
      reject(errData.parserError);
    });

    pdfParser.on("pdfParser_dataReady", pdfData => {
      // Extract the raw text and clean it up
      const text = pdfParser.getRawTextContent().trim();
      resolve(text);
    });

    // Feed the memory buffer from Multer into the parser
    pdfParser.parseBuffer(pdfBuffer);
  });
};