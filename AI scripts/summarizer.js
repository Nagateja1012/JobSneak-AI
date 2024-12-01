import DOMPurify from 'dompurify';
import {updateStageColor, loadingStart, loadingEnd} from "../sidepanel/tracker"
import {jobDescPrompt} from "./prompts"
// The underlying model has a context of 1,024 tokens, out of which 26 are used by the internal prompt,
// leaving about 998 tokens for the input text. Each token corresponds, roughly, to about 4 characters, so 4,000
// is used as a limit to warn the user the content might be too long to summarize.
const MAX_MODEL_CHARS = 4000;

let pageContent = '';


const summaryElement = document.body.querySelector('#summary');
const warningElement = document.body.querySelector('#warning');
const warn = document.body.querySelector('#summary-content');

chrome.storage.session.get('pageContent', ({ pageContent }) => {
  onContentChange(pageContent);
});

chrome.storage.session.onChanged.addListener((changes) => {
  const pageContent = changes['pageContent'];
  onContentChange(pageContent.newValue);
});

async function onContentChange(newContent) {
  if (pageContent == newContent) {
    // no new content, do nothing
    return;
  }
  pageContent = newContent;
  let summary;
  if (newContent) {
    if (newContent.length > MAX_MODEL_CHARS) {
      updateWarning(
        `Text is too long for summarization with ${newContent.length} characters (maximum supported content length is ~4000 characters).`
      );
    } else {
      updateWarning('');
    }
    
    summary = await generateSummary(newContent);
  } else {
    summary = "There's nothing to summarize";
  }
  showSummary(summary);
}

export async function generateSummary(text, summaryContext ) {
  try {
    if(!summaryContext) summaryContext = jobDescPrompt;
    const session = await createSummarizer(
      {
        type: "key-points",
        format: "plain-text",
        length: "short",
        context: summaryContext
        
      },
      (message, progress) => {
        console.log(`${message} (${progress.loaded}/${progress.total})`);
      }
    );
    loadingStart();
    const summary = await session.summarize(text);
    loadingEnd();
    session.destroy();
    
    return summary;
  } catch (e) {
    console.log('Summary generation failed');
    updateStageColor("stage-1", "error",e.message);
    return 
  }
}

export async function SummarizerAiModel() {
  const model = await window.ai.summarizer.capabilities();
    switch (model.available){
      case "no":
        updateStageColor("stage-1", "error",'AI Summarization is not supported');
        break;
      case "readily":
        updateStageColor("stage-1", "completed");
        break;
      case "after-download":
        updateStageColor("stage-1", "processing");
        summarizationSession.addEventListener(
          'downloadprogress',
          downloadProgressCallback
        );
        await summarizationSession.ready;
        break;
    }

     
}

async function createSummarizer(config, downloadProgressCallback) {
  if (!window.ai || !window.ai.summarizer) {
    updateStageColor("stage-1", "error",'AI Summarization is not supported in this browser' );
    
  }
  SummarizerAiModel();
  const summarizationSession = await self.ai.summarizer.create(
    config,
    downloadProgressCallback
  );
  return summarizationSession;
}

async function showSummary(text) {
  summaryElement.innerHTML = DOMPurify.sanitize(text);

}

async function updateWarning(warning) {
  
  warningElement.textContent = warning;
  if (warning) {
    warningElement.removeAttribute('hidden');
  } else {
    warningElement.setAttribute('hidden', '');
  }
 
  
}
