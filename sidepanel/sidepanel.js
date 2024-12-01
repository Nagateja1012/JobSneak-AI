
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/build/pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs";
import { generateSummary,SummarizerAiModel } from "../AI scripts/summarizer";
import {updateStageColor} from "./tracker"
let fullText = "";

// Set the workerSrc to the bundled worker file
GlobalWorkerOptions.workerSrc = pdfWorker;
document.addEventListener("DOMContentLoaded", function () {
  // Handle resume option selection
  const resumeOptionSelect = document.getElementById("resume-option");
  const uploadResumeDiv = document.getElementById("upload-resume");
  const typeResumeDiv = document.getElementById("type-resume");
  const resumeSection = document.querySelector(".resume-selection");
  const saveButton = document.getElementById("save-btn");
  const deleteButton = document.getElementById("delete-btn");
  const clear = document.getElementById("clear-btn");
  const profileDiv = document.getElementById("profiledata");
  

  // Progress tracker stages
  const stages = [
    document.getElementById("stage-1"),
    document.getElementById("stage-2"),
    document.getElementById("stage-3"),
    document.getElementById("stage-4"),
    document.getElementById("stage-5"),
  ];

  SummarizerAiModel();
  

    // Read the summary
    async function readSummary() {
      return (await chrome.storage.local.get("summary")).summary;
      
    }
    //store summary
    async function storeSummary(summary) {
      await chrome.storage.local.set({ summary: summary });
      updateStageColor("stage-2","completed");
      window.location.reload(); 
    }
    //delete summary
    async function deleteSummary() {
     await chrome.storage.local.remove("summary")
     window.location.reload(); 
    }

  // Initial setting: Show upload option by default
  resumeOptionSelect.addEventListener("change", function () {
    if (resumeOptionSelect.value === "upload") {
      uploadResumeDiv.classList.add("show");
      typeResumeDiv.classList.remove("show");
    } else {
      typeResumeDiv.classList.add("show");
      uploadResumeDiv.classList.remove("show");
    }
  });

  //Initial setting: Hide the resume section
  readSummary().then(summary => {
  if (summary) {
    updateStageColor("stage-2","completed");
    profileDiv.classList.remove("hidden");
    resumeSection.classList.add("hidden"); 
  } else {
    resumeSection.classList.remove("hidden"); 
    profileDiv.classList.add("hidden"); 
  }
})
  //Handle delete button click
  deleteButton.addEventListener("click", async () =>{
    deleteSummary();
  })

  //Handle clear button click
  clear.addEventListener("click", function () {
    document.getElementById("resume-file").value = "";
    document.getElementById("resume-text").value = "";
    resumeOptionSelect.value = "upload"; 
    uploadResumeDiv.classList.add("show");
    typeResumeDiv.classList.remove("show");
  });


  // Handle Save button click
  saveButton.addEventListener("click", async () => {
    if (resumeOptionSelect.value === "upload") {
      updateStageColor("stage-2","processing");
    const sum = await generateSummary(fullText);
    storeSummary(sum);
    }
    else{
      storeSummary(document.getElementById("resume-text").value);
    }
  });
  // Trigger the initial change on load
  resumeOptionSelect.dispatchEvent(new Event("change"));
});




document
  .getElementById("resume-file")
  .addEventListener("change", async (event) => {
    const fileInput = event.target;

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

      // Loop through each page and extract text
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(" ");
        fullText += `Page ${i}:\n${pageText}\n\n`;
      }
    };

    reader.readAsArrayBuffer(file);
  });
