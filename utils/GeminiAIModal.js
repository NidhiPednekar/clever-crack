import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
});

const tools = [
  {
    googleSearch: {},
  },
];

const config = {
  thinkingConfig: {
    thinkingBudget: -1,
  },
  tools,
  responseMimeType: 'text/plain',
  generationConfig: {
    maxOutputTokens: 4096,  // Increase token limit
    temperature: 0.7,      // Balance between creativity and focus
    topP: 0.9,            // Controls diversity of responses
    topK: 40,             // Controls randomness
  },
  safetySettings: [
    {
      category: 'HARM_CATEGORY_HARASSMENT',
      threshold: 'BLOCK_NONE',
    },
    {
      category: 'HARM_CATEGORY_HATE_SPEECH',
      threshold: 'BLOCK_NONE',
    },
    {
      category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      threshold: 'BLOCK_NONE',
    },
    {
      category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
      threshold: 'BLOCK_NONE',
    },
  ],
};

const model = 'gemini-2.5-pro';

export async function getGeminiResponse(userPrompt) {
  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: userPrompt,
        },
      ],
    },
  ];

  const response = await ai.models.generateContent({
    model,
    config,
    contents,
  });

  const text =
  response?.candidates?.[0]?.content?.parts?.[0]?.text ||
  "No response from Gemini API";

  return text;
}
  
  

  