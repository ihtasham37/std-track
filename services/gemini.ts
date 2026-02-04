import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { UserProfile, AppMode } from "../types";

// Safety check for API Key initialization
const getAIClient = () => {
  const key = process.env.API_KEY;
  if (!key) {
    throw new Error("Configuration Error: API Key not found in environment. Please add API_KEY to Netlify variables.");
  }
  return new GoogleGenAI({ apiKey: key });
};

const SKILL_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING },
    courses: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          url: { type: Type.STRING },
          platform: { type: Type.STRING },
          description: { type: Type.STRING },
          type: { type: Type.STRING }
        },
        required: ["title", "url", "platform", "description", "type"]
      }
    }
  },
  required: ["summary", "courses"]
};

const UNI_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING },
    universities: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          degree: { type: Type.STRING },
          location: { type: Type.STRING },
          description: { type: Type.STRING },
          website: { type: Type.STRING }
        },
        required: ["name", "degree", "location", "description", "website"]
      }
    }
  },
  required: ["summary", "universities"]
};

const SCHOLARSHIP_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING },
    scholarships: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          provider: { type: Type.STRING },
          coverage: { type: Type.STRING },
          description: { type: Type.STRING },
          link: { type: Type.STRING }
        },
        required: ["name", "provider", "coverage", "description", "link"]
      }
    }
  },
  required: ["summary", "scholarships"]
};

const JOB_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING },
    jobs: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          company: { type: Type.STRING },
          location: { type: Type.STRING },
          description: { type: Type.STRING },
          link: { type: Type.STRING }
        },
        required: ["title", "company", "location", "description", "link"]
      }
    }
  },
  required: ["summary", "jobs"]
};

export async function generateAIContent(mode: AppMode, profile: UserProfile): Promise<any> {
  try {
    const ai = getAIClient();
    let prompt = "";
    let schema: any;

    if (mode === 'SKILL') {
      prompt = `Act as a Skill Architect. Create a roadmap for learning ${profile.interests?.[0] || 'Web Development'}. Consider my ${profile.education} level and ${profile.skills?.join(', ') || 'no prior'} skills. Provide 10 specific courses with links.`;
      schema = SKILL_SCHEMA;
    } else if (mode === 'UNIVERSITY') {
      prompt = `Act as a University Scout. Suggest 12 universities for ${profile.targetField || 'Computer Science'} in ${profile.country || 'the world'}.`;
      schema = UNI_SCHEMA;
    } else if (mode === 'SCHOLARSHIP') {
      prompt = `Act as a Scholarship Finder. Locate 10 global scholarships for students studying ${profile.interests?.[0] || 'Engineering'}.`;
      schema = SCHOLARSHIP_SCHEMA;
    } else {
      prompt = `Act as a Job Agent. Find 15 matching job roles for "${profile.targetJob}" in ${profile.targetCity || 'major tech hubs'}.`;
      schema = JOB_SCHEMA;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', 
      contents: prompt,
      config: { 
        responseMimeType: "application/json", 
        responseSchema: schema,
        temperature: 0.8
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("AI Synthesis produced an empty response.");
    return JSON.parse(resultText.trim());
  } catch (error: any) {
    console.error("Gemini Failure:", error);
    throw new Error(error.message || "Neural Engine Connection Failed.");
  }
}

export async function* askAcademicQuestionStream(
  question: string, 
  history: { role: 'user' | 'ai', text: string }[],
  context: any
) {
  try {
    const ai = getAIClient();
    const historyParts = history.map(h => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.text }]
    }));

    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: { 
        systemInstruction: `You are an expert academic advisor for StdTrack AI. Context: User is viewing ${context.selectedDetail}. Provide precise, helpful guidance.`,
        temperature: 0.9 
      },
      history: historyParts.slice(-6),
    });

    const stream = await chat.sendMessageStream({ message: question });
    for await (const chunk of stream) {
      const c = chunk as GenerateContentResponse;
      if (c.text) yield c.text;
    }
  } catch (error) {
    console.error("Chat Stream Error:", error);
    yield "I encountered a synchronization error. Please try again.";
  }
}