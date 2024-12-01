// Wait for the page to load completely



window.addEventListener("load", function () {
  const observer = new MutationObserver(() => {
    // Locate the element containing "Job Description"
    const jobDescription = Array.from(document.querySelectorAll('*'))
      .find(el => el.textContent?.trim() === "About the job");
    if (jobDescription) {
      // Check if the div already exists to prevent duplicates
      if (!document.getElementById("custom-job-div")) {
        // Create the custom div
        const customDiv = document.createElement("div");
        customDiv.id = "custom-job-div";
        customDiv.className = "custom-div";


        // Add content to the div
        customDiv.innerHTML = `
        <script src="index.js" type="module"></script>
        <div>
          <i class="icon-placeholder" style="font-size: 16px;" >😵</i>
          <i class="icon-placeholder" style="font-size: 32px;">😓</i>
          <i class="icon-placeholder" style="font-size: 16px;">🙂</i>
          <i class="icon-placeholder" style="font-size: 16px;">😎</i>
          <i class="icon-placeholder" style="font-size: 16px;">😍</i>
        </div>
        <div id="summary-content">Loading summary</div>

          
        ` ;
       

        // Insert after the job description element
        jobDescription.parentNode.insertBefore(customDiv, jobDescription.previousSibling);

        const summaryInterval = setInterval(() => {
          const sum = chrome.storage.local.get("summaryFrom", (result) => result.summaryFrom) 
          if (sum && document.getElementById("summary-content")) {
            // Update the content dynamically when `summaryfrom` is available
            document.getElementById("summary-content").innerHTML = sum;
            console.log("Value retrieved in content.js:", sum);
            clearInterval(summaryInterval); // Stop checking once updated
          }
        }, 100);
      }
    }
  });

  // Observe the body for changes
  observer.observe(document.body, { childList: true, subtree: true });
});
