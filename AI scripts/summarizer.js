import DOMPurify from 'dompurify';
import { marked } from 'marked';
import {updateStageColor} from "../sidepanel/tracker"
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

export async function generateSummary(text) {
  try {
    const session = await createSummarizer(
      {
        type: "teaser",
        format: "markdown",
        length: "short",
        sharedContext: `
        Extract only these details from the job description:
Experience: Required years/fields.
Sponsorship: Provided or needed.
Salary: Range or amount.
Skills: Key technical/soft skills.
Location: Onsite/remote/city.
Present in bullet points.

`,
      },
      (message, progress) => {
        console.log(`${message} (${progress.loaded}/${progress.total})`);
      }
    );
    const summary = await session.summarize(text);
    session.destroy();
    return summary;
  } catch (e) {
    console.log('Summary generation failed');
    return 'Error: ' + e.message;
  }
}

export async function SummarizerAiModel() {
  const model = await window.ai.summarizer.capabilities();
    switch (model.available){
      case "no":
        updateStageColor("stage-1", "error");
        throw new Error('AI Summarization is not supported');
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
    updateStageColor("stage-1", "error");
    throw new Error('AI Summarization is not supported in this browser');
  }
  SummarizerAiModel();
  const summarizationSession = await self.ai.summarizer.create(
    config,
    downloadProgressCallback
  );
  return summarizationSession;
}

async function showSummary(text) {
  summaryElement.innerHTML = DOMPurify.sanitize(marked.parse(text));

}

async function updateWarning(warning) {
  
  warningElement.textContent = warning;
  if (warning) {
    warningElement.removeAttribute('hidden');
  } else {
    warningElement.setAttribute('hidden', '');
  }
 
  
}
