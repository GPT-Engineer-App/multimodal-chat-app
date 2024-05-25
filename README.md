# multimodal-chat-app

Project Overview:
Develop a Node.js-based chat application using Google GenAI APIs. The application will record and upload video files, send these files to the AI model for analysis, and output the response both in the console and via Text-to-Speech (TTS). The application should exploit multimodal capabilities, focusing on qualities perceptible through video and audio that are not evident in text, such as tone, inflection, and non-verbal cues.

Functional Requirements:

Video Recording:

Implement functionality to start and stop video recording using a key press (spacebar).
Handle media permissions for video recording.
File Upload and Processing:

Upload the recorded video file to the Google GenAI API.
Implement a polling mechanism to wait for the video file to be processed and become active.
Context Awareness:

Ensure the AI model maintains context across multiple inputs.
Exploit multimodal capabilities to focus on qualities perceptible through video and audio, such as tone, inflection, and non-verbal cues.
Console Output:

Display detailed console logs showing the progress of file uploads, processing status, and API responses.
Implement robust error handling to log and manage errors gracefully.
Text-to-Speech (TTS) Output:

Use TTS to audibly output the AI model's response.
Example Code Structure:
The code should be organized into clear and modular functions, focusing on the core functionalities of video recording, file uploading, processing, and handling AI model responses.

Implementation Details:

1. Install necessary dependencies:

bash
Copy code
npm install @google/generative-ai dotenv
2. Create a .env file in the project root:

plaintext
Copy code
GEMINI_API_KEY=your_api_key_here
3. Develop the main application script:

javascript
Copy code
/**
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 *
 * See the getting started guide for more information:
 * https://ai.google.dev/gemini-api/docs/get-started/node
 */

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/files");

require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

/**
 * Uploads the given file to Gemini.
 */
async function uploadToGemini(path, mimeType) {
  const uploadResult = await fileManager.uploadFile(path, { mimeType, displayName: path });
  const file = uploadResult.file;
  console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
  return file;
}

/**
 * Waits for the given files to be active.
 */
async function waitForFilesActive(...files) {
  console.log("Waiting for file processing...");
  for (const file of files) {
    let currentFile = await fileManager.getFile(file.name);
    while (currentFile.state === "PROCESSING") {
      process.stdout.write(".");
      await new Promise(resolve => setTimeout(resolve, 10000));
      currentFile = await fileManager.getFile(file.name);
    }
    if (currentFile.state !== "ACTIVE") {
      throw new Error(`File ${currentFile.name} failed to process`);
    }
  }
  console.log("...all files ready\n");
}

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

async function run() {
  try {
    // Update the file path as needed
    const videoAmhn10min = await uploadToGemini("American Museum of Natural History Tour - 10 Min", "video/mp4");

    // Wait for video file to be ready
    await waitForFilesActive(videoAmhn10min);

    const chatSession = model.startChat({
      generationConfig,
      safetySettings,
      history: [
        {
          role: "user",
          parts: [
            {
              fileData: {
                mimeType: videoAmhn10min.mimeType,
                fileUri: videoAmhn10min.uri,
              },
            },
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage("Tell me about this video.");
    console.log(result.response.text());
  } catch (error) {
    console.error("Error:", error.message);
  }
}

run();
Important Notes:

Ensure you replace your_api_key_here with the actual API key in the .env file.
This script handles video recording using a separate function and includes error handling for all stages of the process.
Thoroughly test the application to ensure it handles video recording, uploading, and AI responses as expected. AIzaSyCBRCcgTs3ynXMFUxoQY9izflwz8wqJ4KA

## Collaborate with GPT Engineer

This is a [gptengineer.app](https://gptengineer.app)-synced repository 🌟🤖

Changes made via gptengineer.app will be committed to this repo.

If you clone this repo and push changes, you will have them reflected in the GPT Engineer UI.

## Tech stack

This project is built with React and Chakra UI.

- Vite
- React
- Chakra UI

## Setup

```sh
git clone https://github.com/GPT-Engineer-App/multimodal-chat-app.git
cd multimodal-chat-app
npm i
```

```sh
npm run dev
```

This will run a dev server with auto reloading and an instant preview.

## Requirements

- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
