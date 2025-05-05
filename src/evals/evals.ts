//evals.ts

import { EvalConfig } from 'mcp-evals';
import { openai } from "@ai-sdk/openai";
import { grade, EvalFunction } from "mcp-evals";

const sleepDataToolEval: EvalFunction = {
    name: "sleepDataToolEval",
    description: "Evaluates the retrieval of sleep data from the Fitbit API for a specific date range",
    run: async () => {
        const result = await grade(openai("gpt-4"), "Please retrieve the sleep data from 2023-01-01 to 2023-01-05.");
        return JSON.parse(result);
    }
};

const WeightToolEval: EvalFunction = {
    name: "Weight Tool Evaluation",
    description: "Evaluates retrieving weight data from Fitbit API for a specified period",
    run: async () => {
        const result = await grade(openai("gpt-4"), "Retrieve my weight data for the past 7 days.");
        return JSON.parse(result);
    }
};

const FitbitProfileToolEvaluation: EvalFunction = {
    name: 'FitbitProfileToolEvaluation',
    description: 'Evaluates the Fitbit profile tool by requesting Fitbit user profile data retrieval',
    run: async () => {
        const result = await grade(openai("gpt-4"), "Please retrieve my Fitbit user profile data");
        return JSON.parse(result);
    }
};

const config: EvalConfig = {
    model: openai("gpt-4"),
    evals: [sleepDataToolEval, WeightToolEval, FitbitProfileToolEvaluation]
};
  
export default config;
  
export const evals = [sleepDataToolEval, WeightToolEval, FitbitProfileToolEvaluation];