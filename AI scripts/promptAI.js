import {
  updateStageColor,
  loadingStart,
  loadingEnd,
  matchingHeart,
} from "../sidepanel/tracker";
import { promptAiContextPrompt } from "./prompts";

let session;

async function runPrompt(prompt, params) {
  try {
    if (!session) {
      session = await chrome.aiOriginTrial.languageModel.create(params);
    }
    const aiReply = session.prompt(prompt);

    return aiReply;
  } catch (e) {
    updateStageColor("stage-3", "error", e);
    reset();
  }
}

async function reset() {
  if (session) {
    session.destroy();
  }
  session = null;
}

async function initDefaults() {
  if (!("aiOriginTrial" in chrome)) {
    updateStageColor(
      "stage-3",
      "error",
      "chrome.aiOriginTrial not supported in this browser"
    );
    return;
  }
  PromptAiModel();
}

export async function PromptAiModel() {
  const model = await chrome.aiOriginTrial.languageModel.capabilities();
  switch (model.available) {
    case "no":
      updateStageColor("stage-3", "error", "Prompt AI is not supported");
      break;
    case "readily":
      updateStageColor("stage-3", "completed");
      break;
    case "after-download":
      updateStageColor("stage-3", "processing");
      summarizationSession.addEventListener(
        "downloadprogress",
        downloadProgressCallback
      );
      await summarizationSession.ready;
      break;
  }
}

initDefaults();

export async function PromptAi(jobDescSummary) {
  try{
  const params = {
    systemPrompt: promptAiContextPrompt,
    temperature: 1,
    topK: 3,
  };
  const profileSummary = (await chrome.storage.local.get("summary")).summary;
  const promptBuilder = `job description: ${jobDescSummary}\nprofile: ${profileSummary}`;
  loadingStart();
  const response = await runPrompt(promptBuilder, params);
  loadingEnd();
  extractScore(response);
}
catch(e){
  console.log(e);
}
}

export function extractScore(response) {
  const pattern = /\b(10|[1-9])\b/g;

  // Function to extract the score

  const match = response.match(pattern); // Get matches
  if (match) {
    const score = parseInt(match[0], 10); // Convert to integer
    matchingHeart(score);
  }
}
