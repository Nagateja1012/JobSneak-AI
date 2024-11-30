// Wait for DOM content to be loaded
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/build/pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs";
import {generateSummary} from "../sidepanel/index"

let fullText = "";

// Set the workerSrc to the bundled worker file
GlobalWorkerOptions.workerSrc = pdfWorker;
document.addEventListener('DOMContentLoaded', function () {
  
    // Handle resume option selection
    const resumeOptionSelect = document.getElementById('resume-option');
    const uploadResumeDiv = document.getElementById('upload-resume');
    const typeResumeDiv = document.getElementById('type-resume');
  
    // Progress tracker stages
    const stages = [
      document.getElementById('stage-1'),
      document.getElementById('stage-2'),
      document.getElementById('stage-3'),
      document.getElementById('stage-4'),
      document.getElementById('stage-5')
    ];
  
    // Initial setting: Show upload option by default
    resumeOptionSelect.addEventListener('change', function () {
      if (resumeOptionSelect.value === 'upload') {
        uploadResumeDiv.classList.add('show');
        typeResumeDiv.classList.remove('show');
      } else {
        typeResumeDiv.classList.add('show');
        uploadResumeDiv.classList.remove('show');
      }
    });
        
        
    function storeSummary(summary) {
        chrome.storage.local.set({ summary: summary }, () => {
          console.log("Summary saved:", summary);
        });
      }
      
      // Read the summary
      function readSummary() {
        chrome.storage.local.get("summary", (data) => {
          if (data.summary) {
            console.log("Stored summary:", data.summary);
          } else {
            
            console.log("No summary found.");
            return true;
          }
        });
      }
      
        

      
    // Handle Save button click
    const saveButton = document.getElementById('save-btn');
    saveButton.addEventListener('click', async () =>{
        if(readSummary()){
        console.log("h");
        const sum = await generateSummary(fullText);

        storeSummary(sum)
  
        output.textContent = sum

        }

      // Simulating a progression update based on action
        

      
      // Update the progress tracker stages
    //   stages.forEach((stage, index) => {
    //     stage.classList.remove('active', 'completed');
    //     if (index < progress) {
    //       stage.classList.add('completed');
    //     } else if (index === progress) {
    //       stage.classList.add('active');
    //     }
    //   });
    });

  
    // Handle Delete button click
    const deleteButton = document.getElementById('clear-btn');
    deleteButton.addEventListener('click', function () {
      // Clear inputs and reset progress tracker
      document.getElementById('resume-file').value = '';
      document.getElementById('resume-text').value = '';
      resumeOptionSelect.value = 'upload';  // Reset to default option
      uploadResumeDiv.classList.add('show');
      typeResumeDiv.classList.remove('show');
  
      // Reset all progress stages
    //   stages.forEach(stage => {
    //     stage.classList.remove('active', 'completed');
    //   });
    });
    
    // Trigger the initial change on load
    resumeOptionSelect.dispatchEvent(new Event('change'));
  });
// Define the stages and their initial statuses
const stages = [
    { id: 'stage-1', status: 'not-started', tooltip: 'Not Started' },
    { id: 'stage-2', status: 'not-started', tooltip: 'Processing' },
    { id: 'stage-3', status: 'completed', tooltip: 'Completed' },
    { id: 'stage-4', status: 'errors', tooltip: 'Error' },
    { id: 'stage-5', status: 'not-started', tooltip: 'Not Started' },
    { id: 'stage-6', status: 'processing', tooltip: 'Processing' }
  ];
  
  // Function to update the status and color of a stage
  function updateStageColor(stageId, status) {
    const stageElement = document.getElementById(stageId);
    const stageData = stages.find(stage => stage.id === stageId);
  
    // Update the status
    stageData.status = status;
  
    // Remove previous status class
    stageElement.classList.remove('not-started', 'processing', 'completed', 'errors');
  
    // Add the new status class
    switch (status) {
      case 'not-started':
        stageElement.classList.add('not-started');
        break;
      case 'processing':
        stageElement.classList.add('processing');
        break;
      case 'completed':
        stageElement.classList.add('completed');
        break;
      case 'errors':
        stageElement.classList.add('errors');
        break;
    }
  
    // Update tooltip text
    const tooltip = stageElement.querySelector('.stage-tooltip');
    tooltip.textContent = `${stageData.tooltip}: ${status}`;
  }
  
  // Initialize the stages on load
  stages.forEach(stage => {
    updateStageColor(stage.id, stage.status);
  });
  
  // Add event listeners for clicking on stages
  document.querySelectorAll('.tracker-stage').forEach(stageElement => {
    const warningElement = document.body.querySelector('#warning');
    async function updateWarning(warning) {
        warningElement.textContent = warning;
        if (warning) {
          warningElement.removeAttribute('hidden');
        } else {
          warningElement.setAttribute('hidden', '');
        }
      }
    stageElement.addEventListener('click', () => {
      const stageId = stageElement.id;
      const stageData = stages.find(stage => stage.id === stageId);
      
      // If the status is 'errors', log the error to the console
      if (stageData.status === 'errors') {
        updateWarning(`Error in stage ${stageId}!`);
        stageElement.classList.add('active'); // Add active styling for errors
      }
    });
  });

  document.getElementById("resume-file").addEventListener("change", async (event) => {
        
      
      
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
        const pageText = textContent.items.map(item => item.str).join(" ");
        fullText += `Page ${i}:\n${pageText}\n\n`;
      }
  
    };
  
    reader.readAsArrayBuffer(file);
  });
    