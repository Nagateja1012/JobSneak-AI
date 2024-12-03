# JobSneak AI: Streamline Job Search with AI

Simplify your job search with a **Chrome extension** powered by **Google Gemini AI Nano** (Developer trials). It summarizes resumes and job descriptions, evaluates compatibility, and saves time during applications.

---

## Features
- **Profile Summarization:** Summarize your resume and filters using Summarizer API.  
- **Job Description Summarization:** Shortens lengthy job descriptions for easier reading.  
- **Compatibility Scoring:** Rates job descriptions based on your profile using PromptAPI.  
- **Cross-Site Support:** Works across multiple job sites.  
- **Status Tracker:** Tracks readiness of profile, Summarizer API, and PromptAPI.  
- **Error Handling:** Displays errors with troubleshooting guidance.  

---

## Demo  
Watch the [demo video](https://youtu.be/JHRqYkQPcZg) for a quick overview.

---

## Installation  

### Prerequisites  
1. Chrome Dev/Canary version **127+**.
2. Enable required flags:  
   - `chrome://flags/#prompt-api-for-gemini-nano` → **Enabled**  
   - `chrome://flags/#optimization-guide-on-device-model` → **Enabled BypassPrefRequirement**  
3. Update **Optimization Guide On Device Model**:  
   - Go to `chrome://components` → **Check for Update**.  

### Steps  
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory> 
2. Edit `manifest.json` to set the **key** property for a fixed extension ID.
3. Register **origin trails** as per the [Prompt API guide](https://developer.chrome.com/docs/extensions/ai/prompt-api).
4. Update **trial_tokens** with `Your_Token` in `manifest.json`
5. Install `Node` and build the project:
   ```bash
   npm install
   npm run build
6. Load the extension:
   - Go to `chrome://extensions`
   - Enable **Developer Mode**.
   - Click **Load unpacked** → **Select the dist folder**.
---
### Troubleshooting
1. **Error: Model took too long to respond or unavailable config.**
    - Navigate to `chrome://flags/#optimization-guide-on-device-model` and set it to **Disabled**, relaunch, then set it to **Enabled BypassPrefRequirement**, and relaunch again.
    - Try reinstalling **Chrome Dev or Canary.**
2.  **Tracker Red Status:** Hover for error details or click to troubleshoot.
    #### Status Tracker
    -  **Profile Data:** Saved profile readiness.
    -  **Summarizer AI:** Summarizer API status.
    -  **Prompt AI:** PromptAPI functionality.
    -  **Green:** Functional.
    -  **Red:** Needs attention.
