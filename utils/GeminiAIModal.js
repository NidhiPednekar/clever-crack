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
  
  

  