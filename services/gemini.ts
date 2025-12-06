import { GoogleGenAI, Type, Schema } from "@google/genai";
import { DanceStyle, GeneratedRoutine, Message, RoutineStep } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// System instruction for the chat coach
const COACH_SYSTEM_INSTRUCTION = `
You are "Maestro", a world-class fusion dance coach. 
Your expertise implies a deep understanding of:
1. Classical Ballet (Technique, French terminology, posture)
2. Contemporary (Fluidity, floor work, emotional expression)
3. Jazz (Isolations, dynamics, performance)
4. Hip Hop (Groove, texture, musicality)
5. K-Pop (Sharpness, formations, camera appeal)

You speak with a mix of strict technical discipline (Ballet) and hype/energy (Hip Hop).
Always encourage the student but point out technical corrections.
When explaining moves, use proper terminology but explain it simply if it's complex.
`;

export const sendMessageToCoach = async (
  history: Message[], 
  newMessage: string
): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    
    // Construct prompt from history
    const chatHistory = history.map(h => ({
      role: h.role,
      parts: [{ text: h.content }],
    }));

    // We use generateContent for a single turn here effectively by passing context, 
    // but using ai.chats is cleaner if we persisted the object. 
    // Since this is a stateless request wrapper, we'll use generateContent with system instruction context 
    // implicitly handled by how we prompt or simple chat usage.
    
    const chat = ai.chats.create({
      model,
      config: {
        systemInstruction: COACH_SYSTEM_INSTRUCTION,
      },
      history: chatHistory
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text || "I'm focusing on the beat, ask me again.";
  } catch (error) {
    console.error("Coach Error:", error);
    return "Let's take a 5-minute break. I'm having trouble connecting to the rhythm (API Error).";
  }
};

export const generateChoreography = async (
  styles: DanceStyle[],
  difficulty: string,
  songVibe: string
): Promise<GeneratedRoutine> => {
  try {
    const model = 'gemini-2.5-flash';

    const prompt = `
      Create a unique 8-count dance routine (approx 4-8 bars of 8 counts).
      
      Styles to Mix: ${styles.join(', ')}.
      Difficulty: ${difficulty}.
      Song Vibe/Music: ${songVibe}.
      
      The choreography must be a FUSION. For example, do a pirouette that lands in a hip-hop squat, or a jazz drag into a K-pop isolation.
      
      Return JSON format matching the schema provided.
    `;

    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: "A creative name for this routine" },
        difficulty: { type: Type.STRING, enum: ["Beginner", "Intermediate", "Advanced"] },
        vibe: { type: Type.STRING },
        musicSuggestion: { type: Type.STRING, description: "A real or imagined song style that fits" },
        steps: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              count: { type: Type.STRING, description: "The count, e.g. '1-2', '3 & 4'" },
              action: { type: Type.STRING, description: "Description of the movement" },
              technicalNote: { type: Type.STRING, description: "Tips on form or texture" },
              styleFocus: { type: Type.STRING, description: "Which style is dominant in this step", enum: Object.values(DanceStyle) }
            },
            required: ["count", "action", "technicalNote", "styleFocus"]
          }
        }
      },
      required: ["title", "difficulty", "vibe", "steps", "musicSuggestion"]
    };

    const result = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    if (result.text) {
      return JSON.parse(result.text) as GeneratedRoutine;
    }
    throw new Error("No choreography generated");

  } catch (error) {
    console.error("Choreo Generation Error:", error);
    throw error;
  }
};
