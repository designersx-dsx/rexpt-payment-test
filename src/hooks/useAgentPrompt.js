// lib/getAgentPrompt.js
import { agentPromptTemplates } from "../lib/agentPromptTemplates";
export const getAgentPrompt = ({
  industryKey = "",
  roleTitle = "",
  ...vars
}) => {
  const normalizedIndustry = industryKey.trim();
  const industryPrompts = agentPromptTemplates[normalizedIndustry] || agentPromptTemplates.default;
  const promptGenerator = industryPrompts[roleTitle];
  if (!promptGenerator) {
    console.warn(`No prompt found for role "${roleTitle}" in industry "${industryKey}"`);
    return "";
  }

  return promptGenerator(vars);
};
