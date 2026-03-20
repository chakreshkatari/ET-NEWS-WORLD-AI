import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generatePersonalizedFeed = async (persona: string, newsItems: string[]) => {
  const prompt = `You are a personalized AI news editor for a ${persona}.
  Here are today's top business news headlines and summaries:
  ${newsItems.map((item, i) => `${i + 1}. ${item}`).join('\n')}

  Rewrite and curate these news items specifically for a ${persona}.
  - If the persona is an Investor, focus on market impact, portfolio relevance, and stock movements.
  - If the persona is a Startup Founder, focus on funding, competitor moves, and industry trends.
  - If the persona is a Student, focus on explaining complex terms, career implications, and foundational knowledge.

  Return the response as a JSON array of objects, where each object has:
  - id: a unique string
  - title: The personalized headline
  - summary: The personalized summary (2-3 sentences)
  - category: A relevant category tag
  - relevanceScore: A number from 1-100 indicating how relevant this is to the persona.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            category: { type: Type.STRING },
            relevanceScore: { type: Type.NUMBER },
          },
          required: ["id", "title", "summary", "category", "relevanceScore"],
        },
      },
    },
  });

  return JSON.parse(response.text || "[]");
};

export const generateBriefing = async (topic: string, articles: string[]) => {
  const prompt = `Synthesize the following articles about "${topic}" into a single, comprehensive intelligence briefing.
  Articles:
  ${articles.join('\n\n')}

  The briefing should include:
  1. Executive Summary
  2. Key Developments
  3. Implications & Analysis
  4. What to Watch Next

  Format the output in Markdown.`;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
  });

  return response.text;
};

export const answerBriefingQuestion = async (topic: string, briefing: string, question: string) => {
  const prompt = `You are an AI intelligence analyst. Based on the following briefing about "${topic}", answer the user's follow-up question.
  Briefing:
  ${briefing}

  Question: ${question}

  Answer concisely and accurately based on the provided context.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });

  return response.text;
};

export const generateStoryArc = async (topic: string) => {
  const prompt = `Analyze the ongoing business story: "${topic}".
  Build a complete visual narrative including:
  1. An interactive timeline of key events (at least 5 events).
  2. Key players mapped (individuals, companies, institutions) and their roles.
  3. Sentiment shifts tracked over time (e.g., from positive to negative, or uncertain to optimistic).
  4. Contrarian perspectives surfaced (what are the critics saying?).
  5. "What to watch next" predictions.

  Return the response as a JSON object with the following structure:
  {
    "timeline": [{ "date": "YYYY-MM-DD", "event": "Description", "sentiment": "positive|negative|neutral" }],
    "keyPlayers": [{ "name": "Name", "role": "Role/Description", "stance": "Stance on the issue" }],
    "overallSentiment": "Current overall sentiment",
    "contrarianPerspectives": ["Point 1", "Point 2"],
    "predictions": ["Prediction 1", "Prediction 2"]
  }`;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          timeline: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                date: { type: Type.STRING },
                event: { type: Type.STRING },
                sentiment: { type: Type.STRING },
              },
              required: ["date", "event", "sentiment"],
            },
          },
          keyPlayers: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                role: { type: Type.STRING },
                stance: { type: Type.STRING },
              },
              required: ["name", "role", "stance"],
            },
          },
          overallSentiment: { type: Type.STRING },
          contrarianPerspectives: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          predictions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ["timeline", "keyPlayers", "overallSentiment", "contrarianPerspectives", "predictions"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
};

export const translateAndAdapt = async (article: string, language: string) => {
  const prompt = `Translate and culturally adapt the following English business news article into ${language}.
  Do not just do a literal translation. Adapt the explanations with local context, idioms, and cultural nuances appropriate for a native ${language} speaker reading business news.

  Article:
  ${article}

  Return the adapted article in Markdown format.`;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
  });

  return response.text;
};

export const generateVideoScript = async (article: string) => {
    const prompt = `Transform the following business news article into a broadcast-quality short video script (60-120 seconds).
    Include:
    1. Narration (what the voiceover says).
    2. Visuals (descriptions of animated data visuals, B-roll, or contextual overlays).

    Return as a JSON array of scenes:
    [
      {
        "sceneNumber": 1,
        "visual": "Description of the visual",
        "narration": "The exact words to be spoken"
      }
    ]

    Article:
    ${article}
    `;

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        sceneNumber: { type: Type.NUMBER },
                        visual: { type: Type.STRING },
                        narration: { type: Type.STRING },
                    },
                    required: ["sceneNumber", "visual", "narration"],
                }
            }
        }
    });

    return JSON.parse(response.text || "[]");
}

export const generateAudioSpeech = async (text: string) => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: text }] }],
        config: {
            responseModalities: ["AUDIO"],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Puck' },
                },
            },
        },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio;
}
