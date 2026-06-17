/**
 * Suggested questions for the AI Digital Twin, grounded in Qasir's CV and LinkedIn profile.
 */
export const DIGITAL_TWIN_STARTER_PROMPTS = [
  "Tell me about your AI engineering experience",
  "What RAG systems have you built?",
  "How do you handle data fetching in Next.js?",
  "Explain your Azure AI expertise and AI-102 certification",
  "Tell me about your job-discovery Career Copilot",
  "What did you deliver at Hecate Technologies?",
  "How did you improve performance at IPCortex?",
  "What was your impact at British Gas?",
] as const;

export type DigitalTwinStarterPrompt = (typeof DIGITAL_TWIN_STARTER_PROMPTS)[number];
