import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getDiseasePrediction(reports: any[], inspections: any[]) {
  const prompt = `
    Analyze the following agricultural crop health signals and predict potential disease outbreaks in Kerala.
    
    Farmer Reports: ${JSON.stringify(reports.slice(-10))}
    Agricultural Inspections: ${JSON.stringify(inspections.slice(-10))}
    
    Provide a prediction including:
    1. Possible Crop Disease Name
    2. Confidence Score (0-100)
    3. Key Signals Detected (e.g., leaf spots, wilting, humidity)
    4. Recommended Actions for Agricultural Authorities
    5. Spread Probability to neighboring districts.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            disease: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            signals: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            spreadProbability: { type: Type.NUMBER }
          },
          required: ["disease", "confidence", "signals", "recommendations", "spreadProbability"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("AI Prediction Error:", error);
    return {
      disease: "Unknown",
      confidence: 0,
      signals: ["Insufficient data"],
      recommendations: ["Increase field surveillance"],
      spreadProbability: 0
    };
  }
}

export async function detectCropDisease(base64Image: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        { text: "Identify the crop disease from this image. Provide the disease name, confidence, symptoms shown, and treatment recommendations (organic and chemical). Focus on Kerala's agricultural context." },
        { inlineData: { data: base64Image, mimeType: "image/jpeg" } }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            disease: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            symptoms: { type: Type.ARRAY, items: { type: Type.STRING } },
            organicTreatment: { type: Type.STRING },
            chemicalTreatment: { type: Type.STRING }
          },
          required: ["disease", "confidence", "symptoms", "organicTreatment", "chemicalTreatment"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Disease Detection Error:", error);
    return null;
  }
}

export async function getMarketForecast(crop: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Forecast the market price trend for ${crop} in Kerala for the next 30 days. Consider seasonal demand, harvest cycles, and current economic factors. Provide a 30-day price trend array and a summary recommendation.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            trend: { type: Type.ARRAY, items: { type: Type.NUMBER } },
            summary: { type: Type.STRING },
            recommendation: { type: Type.STRING }
          },
          required: ["trend", "summary", "recommendation"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Market Forecast Error:", error);
    return null;
  }
}

export async function getFarmerChatResponse(message: string, history: { role: string, parts: { text: string }[] }[], lang: 'en' | 'ml') {
  try {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: `You are AgriSense Kerala Assistant, an expert in Kerala's agriculture, weather, soil, and markets. Help farmers with crop planning, irrigation schedules, disease ID, and market timing. 
        IMPORTANT: Respond ENTIRELY in ${lang === 'ml' ? 'Malayalam' : 'English'}. 
        Use local Kerala context (e.g., Krishi, Nellu, Thengu). Keep responses concise and practical.`,
      },
      history: history
    });

    const response = await chat.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Chat Error:", error);
    return "I'm sorry, I'm having trouble connecting right now. Please try again later.";
  }
}
