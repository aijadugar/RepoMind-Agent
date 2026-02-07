import { GoogleGenAI, Type } from "@google/genai";
import { RepoAnalysis } from '../types';

// Ensure API Key is available
const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

export const analyzeRepository = async (repoUrl: string): Promise<RepoAnalysis> => {
  if (!apiKey) {
    throw new Error("API_KEY is missing from environment variables.");
  }

  const model = "gemini-3-flash-preview";

  const prompt = `
    You are RepoMind, an elite automated code analysis agent.
    
    Target Repository: ${repoUrl}
    
    Your task is to perform a deep "Mental Model" analysis of what this repository *likely* contains and how it is architected, based on its name, common patterns for such projects, and your training data.
    
    If the repository is real and famous (e.g., facebook/react, vercel/next.js), use your knowledge.
    If it is obscure or generic, infer a highly plausible architecture based on industry standards for such a name/domain.
    
    Output a strictly formatted JSON object. Do not include markdown code blocks.
    
    Required JSON Structure:
    {
      "summary": "One sentence high-level summary",
      "file_tree": ["list", "of", "key", "files", "max", "10"],
      "languages": ["Language1", "Language2"],
      "architecture": "A detailed paragraph describing the high-level architecture pattern (e.g., Monolith, Microservices, Event-driven) and data flow.",
      "modules": [
        { "name": "Module Name", "responsibility": "What this part of the system does" }
      ],
      "risks": [
        { "title": "Risk Title", "description": "Why this is a risk", "severity": "Low|Medium|High|Critical" }
      ],
      "onboarding": ["Step 1", "Step 2", "Step 3", "Step 4"],
      "confidence": "High|Medium|Low"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            file_tree: { type: Type.ARRAY, items: { type: Type.STRING } },
            languages: { type: Type.ARRAY, items: { type: Type.STRING } },
            architecture: { type: Type.STRING },
            modules: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  responsibility: { type: Type.STRING }
                }
              }
            },
            risks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  severity: { type: Type.STRING, enum: ["Low", "Medium", "High", "Critical"] }
                }
              }
            },
            onboarding: { type: Type.ARRAY, items: { type: Type.STRING } },
            confidence: { type: Type.STRING, enum: ["Low", "Medium", "High"] }
          }
        }
      }
    });

    const text = response.text;
    if (!text) {
        throw new Error("Empty response from Gemini");
    }
    
    return JSON.parse(text) as RepoAnalysis;
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw error;
  }
};