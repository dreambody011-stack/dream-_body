
import { GoogleGenAI } from "@google/genai";
import { User } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateFitnessAdvice = async (query: string, userContext: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User Context: ${userContext}\n\nUser Question: ${query}`,
      config: {
        systemInstruction: "You are the Elite AI Coach for Dream Body Fitness. Provide strict, data-driven, and highly motivational responses. Respect all biometrics and restrictions.",
        temperature: 0.7,
      }
    });
    return response.text || "I am processing your data. Stand by.";
  } catch (e) {
    return "The network is saturated. Please retry.";
  }
};

export const generateStarterPlans = async (user: User): Promise<{ workout: string, diet: string }> => {
  const prompt = `
    Generate a complete Fitness Transformation protocol for ${user.name}.
    
    ### USER PROFILE
    - Age: ${new Date().getFullYear() - new Date(user.dob).getFullYear()}
    - Height: ${user.height}cm, Weight: ${user.currentWeight}kg
    - Goal: ${user.fitnessGoal}
    - Target Body Style: ${user.targetBody}
    - Commitment: ${user.weeklyWorkoutDays} workouts per week
    - Activity Level: ${user.activityLevel}

    ### DIETARY CONSTRAINTS (STRICT)
    - ALLERGIES: ${user.allergies || 'None'}
    - DISLIKES: ${user.foodDislikes || 'None'}
    - FORBIDDEN (MEDICAL/RELIGIOUS): ${user.forbiddenFoods || 'None'}

    ### OUTPUT REQUIREMENTS
    Format the response as two distinct sections separated by "|||SEPARATOR|||".
    Section 1: Detailed Workout Plan (Day-by-Day).
    Section 2: Comprehensive Nutrition Plan (Meals & Macros). DO NOT include any forbidden foods or allergens.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { temperature: 0.3 }
    });
    const parts = (response.text || "").split("|||SEPARATOR|||");
    return {
      workout: parts[0]?.trim() || "Workout plan generation failed.",
      diet: parts[1]?.trim() || "Diet plan generation failed."
    };
  } catch (e) {
    return { workout: "Error generating workout.", diet: "Error generating diet." };
  }
};

export const regenerateDietPlan = async (user: User): Promise<string> => {
  const prompt = `
    Regenerate a NEW NUTRITION PLAN for ${user.name}.
    Goal: ${user.fitnessGoal}, Weight: ${user.currentWeight}kg.
    
    STRICT EXCLUSIONS (Allergies/Forbidden): ${user.allergies}, ${user.forbiddenFoods}.
    AVOID (Dislikes): ${user.foodDislikes}.
    
    Provide a full daily meal structure with macros.
  `;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { temperature: 0.5 }
    });
    return response.text || "Regeneration failed.";
  } catch (e) {
    return "AI error during nutrition update.";
  }
};
