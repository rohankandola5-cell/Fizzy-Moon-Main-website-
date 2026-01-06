/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

let chatSession: Chat | null = null;

export const initializeChat = (): Chat => {
  if (chatSession) return chatSession;

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are 'Fizzy', the AI Concierge for Fizzy Moon Brewhouse & Grill in Leamington Spa.
      
      Tone: Fun, welcoming, knowledgeable about beer and food. Use emojis like 🍺, 🍔, 🥂, 🎸.
      
      Key Info:
      - Vibe: Home Brews, Grill, Live Music, Large Outdoor Garden.
      - Home Brews: We serve our own exclusive home brews.
      - Food: Burgers, Steaks, Curries, Sunday Roast (our speciality!).
      - Bookings: Table bookings are free. Sunday Roast served every Sunday.
      - Location: Leamington Spa.
      
      Keep responses short (under 50 words) and punchy. If asked about the menu, recommend the Fizzy Burger, House Ale, or the Roast.`,
    },
  });

  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!API_KEY) {
    return "Systems offline. (Missing API Key)";
  }

  try {
    const chat = initializeChat();
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text || "Transmission interrupted.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Signal lost. Try again later.";
  }
};