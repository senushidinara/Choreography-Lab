import { GoogleGenAI, Type, Schema } from "@google/genai";
import { DanceStyle, GeneratedRoutine, Message, RoutineStep, DailyChallenge } from "../types";

const apiKey = process.env.API_KEY || '';
let ai: any = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

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

// Mock coach responses for when API key is unavailable
const getMockCoachResponse = (message: string): string => {
  const responses = [
    "That's a solid question! Remember, in fusion dancing, we blend the precision of ballet with the groove of hip-hop. Keep your core engaged and let the rhythm guide your movements.",
    "I love your energy! Let me give you some pointers: focus on your isolations—they're key to making those K-pop moves pop. Check your shoulder rolls and make sure your hips stay locked.",
    "Great attempt! Here's what I noticed: your turns need more spotting, and in hip-hop sections, embrace the bounce more. The connection between ballet technique and hip-hop flow is what makes fusion special.",
    "Nice work! One thing to refine: when transitioning between styles, don't lose momentum. Use your plié to absorb the energy from a hip-hop move into a smooth ballet extension.",
    "You've got the foundation! Now let's talk style fusion. Try adding a contemporary floor element to your jazz phrase—it'll give you a fresh take. Remember, fusion is about creative storytelling through movement."
  ];
  return responses[Math.floor(Math.random() * responses.length)];
};

export const sendMessageToCoach = async (
  history: Message[],
  newMessage: string
): Promise<string> => {
  try {
    if (!ai) {
      return getMockCoachResponse(newMessage);
    }

    const model = 'gemini-2.5-flash';

    // Construct prompt from history
    const chatHistory = history.map(h => ({
      role: h.role,
      parts: [{ text: h.content }],
    }));

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
    return getMockCoachResponse(newMessage);
  }
};

const getMockChoreography = (
  styles: DanceStyle[],
  difficulty: string,
  songVibe: string
): GeneratedRoutine => {
  const mockRoutines: Record<string, GeneratedRoutine> = {
    default: {
      title: "Fusion Flow",
      difficulty: (difficulty as "Beginner" | "Intermediate" | "Advanced") || "Intermediate",
      vibe: songVibe || "Upbeat and energetic",
      musicSuggestion: "Contemporary pop with hip-hop beats",
      steps: [
        {
          count: "1-2",
          action: "Begin in a ballet first position, then rise to relevé",
          technicalNote: "Keep your core engaged and shoulders relaxed",
          styleFocus: DanceStyle.Ballet
        },
        {
          count: "3-4",
          action: "Rotate hips left and right in isolation",
          technicalNote: "Let the movement flow from your core, not your shoulders",
          styleFocus: DanceStyle.HipHop
        },
        {
          count: "5-6",
          action: "Execute a smooth chest roll moving forward",
          technicalNote: "Isolate each vertebra for fluidity",
          styleFocus: DanceStyle.Contemporary
        },
        {
          count: "7-8",
          action: "Finish with a sharp hip check and hold",
          technicalNote: "Sharp, controlled movement—this is your K-pop moment",
          styleFocus: DanceStyle.KPop
        }
      ]
    }
  };

  return mockRoutines.default;
};

export const generateChoreography = async (
  styles: DanceStyle[],
  difficulty: string,
  songVibe: string
): Promise<GeneratedRoutine> => {
  try {
    if (!ai) {
      return getMockChoreography(styles, difficulty, songVibe);
    }

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
    return getMockChoreography(styles, difficulty, songVibe);
  }
};

const getMockDailyChallenge = (): DailyChallenge => {
  return {
    id: Date.now().toString(),
    date: new Date().toISOString().split('T')[0],
    title: "Ballet Meets Beat",
    description: "Master the art of blending classical ballet's precision with hip-hop's groove. Today's challenge focuses on maintaining perfect posture while adding rhythmic hip isolations.",
    durationMinutes: 45,
    focusPoints: [
      "Keep your core engaged while performing hip isolations",
      "Maintain turnout from the hips while executing hip-hop moves",
      "Practice smooth transitions between ballet and hip-hop counts"
    ],
    styleMix: [DanceStyle.Ballet, DanceStyle.HipHop],
    workout: {
      title: "Fusion Conditioning",
      focusArea: "Core strength and hip mobility",
      durationMinutes: 20,
      exercises: [
        {
          name: "Planks",
          reps: "3 sets of 45 seconds",
          sets: 3,
          instruction: "Hold a plank position with your core tight. Focus on a straight line from head to heels."
        },
        {
          name: "Squats",
          reps: "15 reps",
          sets: 3,
          instruction: "Perform controlled squats maintaining turnout. Lower until your thighs are parallel to the ground."
        },
        {
          name: "Lunges",
          reps: "12 reps per leg",
          sets: 3,
          instruction: "Step forward into a lunge, keeping your torso upright. Push through your front heel to return to start."
        },
        {
          name: "Burpees",
          reps: "10 reps",
          sets: 2,
          instruction: "Jump back to plank, do a push-up, jump feet back, and jump up. Explosive power!"
        },
        {
          name: "Sit-ups",
          reps: "20 reps",
          sets: 3,
          instruction: "Keep your neck neutral and engage your core as you lift up. Control the descent."
        }
      ]
    }
  };
};

export const generateDailyChallenge = async (): Promise<DailyChallenge> => {
  try {
    if (!ai) {
      return getMockDailyChallenge();
    }

    const model = 'gemini-2.5-flash';
    const prompt = `
      Create a "Daily Fusion Dance Plan".

      Part 1: A creative dance challenge concept mixing 2 random styles.
      Part 2: A conditioning workout tailored for dancers.
      It MUST include standard fitness exercises (e.g., Sit-ups, Planks, Push-ups, Squats, Lunges, Burpees) mixed with dance-specific conditioning.
    `;

    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        date: { type: Type.STRING },
        title: { type: Type.STRING },
        description: { type: Type.STRING, description: "Brief description of the dance challenge." },
        durationMinutes: { type: Type.NUMBER },
        focusPoints: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 bullet points on technique" },
        styleMix: { type: Type.ARRAY, items: { type: Type.STRING, enum: Object.values(DanceStyle) } },
        workout: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            focusArea: { type: Type.STRING },
            durationMinutes: { type: Type.NUMBER },
            exercises: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  reps: { type: Type.STRING },
                  sets: { type: Type.NUMBER },
                  instruction: { type: Type.STRING }
                },
                required: ["name", "reps", "sets", "instruction"]
              }
            }
          },
          required: ["title", "focusArea", "exercises", "durationMinutes"]
        }
      },
      required: ["title", "description", "focusPoints", "styleMix", "workout"]
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
      const data = JSON.parse(result.text);
      return {
        ...data,
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0]
      };
    }
    throw new Error("Failed to generate daily challenge");
  } catch (error) {
    console.error("Daily Challenge Error", error);
    return getMockDailyChallenge();
  }
}

const getMockGradingFeedback = (grade: number, userNotes: string): string => {
  if (grade < 5) {
    return "I see the effort! Every dancer has tough days—use this as a learning moment. Focus on your basics and come back tomorrow ready to nail it.";
  } else if (grade < 8) {
    return "Nice progress! You're on the right track. Now let's refine those transitions and add more intention to your movements. Small details make big differences.";
  } else {
    return "Excellent work! You're really starting to embody the fusion style. Keep this energy up and challenge yourself with more complex choreography next time!";
  }
};

export const submitGrading = async (
  activityType: 'Challenge' | 'Workout',
  activityName: string,
  grade: number,
  userNotes: string
): Promise<string> => {
  try {
    if (!ai) {
      return getMockGradingFeedback(grade, userNotes);
    }

    const model = 'gemini-2.5-flash';
    const prompt = `
      Role: Maestro (Fusion Dance Coach).
      Task: Provide feedback on a student's daily ${activityType}.

      Activity: ${activityName}
      Student's Self-Grade: ${grade}/10.
      Student's Notes: "${userNotes}".

      If the grade is low (<5), be encouraging but strict.
      If the grade is medium (5-8), push them to refine.
      If the grade is high (9-10), celebrate.

      Keep it short (max 2 sentences).
    `;

    const result = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return result.text || "Good work today. Rest up and come back stronger.";
  } catch (error) {
    return getMockGradingFeedback(grade, userNotes);
  }
}
