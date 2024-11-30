import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/build/pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs";

// Set the workerSrc to the bundled worker file
GlobalWorkerOptions.workerSrc = pdfWorker;



document.getElementById("fileInput").addEventListener("change", async (event) => {
  event.preventDefault();


  const fileInput = event.target;
  const output = document.getElementById("output");

  if (!fileInput.files[0]) {
    output.textContent = "Please select a PDF file.";
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();
  

  reader.onload = async function (e) {
    const pdfData = new Uint8Array(e.target.result);

    // Load the PDF document
    const pdf = await getDocument(pdfData).promise;

    let fullText = "";

    // Loop through each page and extract text
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(" ");
      fullText += `Page ${i}:\n${pageText}\n\n`;
    }

    output.textContent = fullText;
  };

  reader.readAsArrayBuffer(file);
});
