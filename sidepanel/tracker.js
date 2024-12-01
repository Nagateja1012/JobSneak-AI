
// Define the stages and their initial statuses
const stages = [
    { id: "stage-1", status: "not-started", tooltip: "Summarizer AI" , error:"" },
    { id: "stage-2", status: "not-started", tooltip: "Profile Data" , error:""},
    { id: "stage-3", status: "not-started", tooltip: "Not Started" , error:""},
    { id: "stage-4", status: "not-started", tooltip: "Not Started", error:""},
    { id: "stage-5", status: "not-started", tooltip: "Not Started" , error:""},
  ];
  
  // Function to update the status and color of a stage
export function updateStageColor(stageId, status, error) {
    const stageElement = document.getElementById(stageId);
    const stageData = stages.find((stage) => stage.id === stageId);
  
    // Update the status
    stageData.status = status;
    if(status === "error") stageData.error = error;
    
  
    // Remove previous status class
    stageElement.classList.remove(
      "not-started",
      "processing",
      "completed",
      "error"
    );
  
    // Add the new status class
    switch (status) {
      case "not-started":
        stageElement.classList.add("not-started");
        break;
      case "processing":
        stageElement.classList.add("processing");
        break;
      case "completed":
        stageElement.classList.add("completed");
        break;
      case "error":
        stageElement.classList.add("error");
        break;
    }
  
    // Update tooltip text
    const tooltip = stageElement.querySelector(".stage-tooltip");
    tooltip.textContent = `${stageData.tooltip}: ${status}`;
  }
  
  // Initialize the stages on load
  stages.forEach((stage) => {
    updateStageColor(stage.id, stage.status);
  });

  const warningElement = document.getElementById("warninge");
  
  // Add event listeners for clicking on stages
  document.querySelectorAll(".tracker-stage").forEach((stageElement) => {
    
    async function updateWarning(warning) {
        
      warningElement.textContent = warning;
      if (warning) {
        warningElement.classList.remove("hidden");
      } else {
        warningElement.classList.add("hidden");
      }
    }
    stageElement.addEventListener("click", () => {
        
        

      const stageId = stageElement.id;
      const stageData = stages.find((stage) => stage.id === stageId);
  
      // If the status is 'errors', log the error to the console
      if (stageData.status === "error") {
        if(!warningElement.classList.contains("hidden")){
            warningElement.classList.add("hidden"); 
            stageElement.classList.remove("active");
        }else{
        updateWarning(stageData.error);
        stageElement.classList.add("active"); // Add active styling for errors
      }}
    });
  });

  export function loadingStart(){
    const loading = document.getElementById("loader");
    loading.classList.remove("hidden");
  }
  export function loadingEnd(){
    const loading = document.getElementById("loader");
    loading.classList.add("hidden"); 
  }


  