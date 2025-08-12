
import { GoogleGenAI } from "@google/genai";
import { ClothingItem } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = (imageDataUrl: string) => {
  return {
    inlineData: {
      data: imageDataUrl.split(',')[1],
      mimeType: imageDataUrl.match(/^data:(image\/[a-zA-Z]+);base64,/)?.[1] || 'image/jpeg',
    },
  };
};

export const getOutfitSuggestion = async (items: ClothingItem[]): Promise<string> => {
  if (items.length === 0) {
    return "Please select some clothes to get a suggestion.";
  }

  const model = 'gemini-2.5-flash';
  
  const systemInstruction = `You are a world-class fashion stylist. Your goal is to help users create stylish outfits from their wardrobe.
    Analyze the provided images of clothing items.
    1. Create a cohesive and stylish outfit combination using ONLY the provided items.
    2. Provide a detailed explanation for your choice, highlighting why the items work well together (e.g., color theory, style contrast, silhouette balance).
    3. Suggest 2-3 specific accessories (like a watch, necklace, bag, or hat) that would complement the outfit. Do not include images of accessories.
    4. Keep your response concise, friendly, and encouraging. Use markdown for formatting (e.g., headings, bold text, lists).`;
  
  const imageParts = items.map(item => fileToGenerativePart(item.imageDataUrl));
  
  const textPart = {
      text: "Please create a stylish outfit from the clothing items I've provided. Explain your choices and suggest some accessories."
  };

  try {
    const response = await ai.models.generateContent({
      model,
      contents: { parts: [...imageParts, textPart] },
      config: {
        systemInstruction,
        temperature: 0.7,
        topP: 1,
        topK: 32,
      }
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating content:", error);
    return "I'm sorry, I had trouble creating an outfit. The selected items might not be clear enough. Please try again with different items.";
  }
};