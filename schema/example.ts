/**
 * Example usage of EvaluationRow schema
 * Demonstrates both per-turn and trajectory evaluation scenarios
 */

import { 
  createEvaluationRow, 
  isEvaluationRow, 
  isTrajectoryEvaluation,
  getAssistantMessages,
  getUserMessages,
  getInputMetadata,
  validateEvaluationRow
} from './evaluation-row';
import type { EvaluationRow, Message, EvaluateResult, StepOutput } from './evaluation-row.d';

// Example 1: Per-Turn Evaluation (Row-wise)
function createPerTurnExample(): EvaluationRow {
  const messages: Message[] = [
    { role: "user", content: "What is 2+2?" },
    { role: "assistant", content: "2+2 equals 4." }
  ];

  const evaluationResult: EvaluateResult = {
    score: 1.0,
    reason: "Correct answer",
    metrics: {
      accuracy: {
        is_score_valid: true,
        score: 1.0,
        reason: "Perfect"
      }
    }
  };

  return createEvaluationRow(messages, {
    groundTruth: "4",
    evaluationResult,
    inputMetadata: {
      row_id: "math_001",
      dataset_info: { source: "math_eval" },
      model_config: { model: "gpt-4", temperature: 0.0 }
    }
  });
}

// Example 2: Per-Trajectory Evaluation (RL)
function createTrajectoryExample(): EvaluationRow {
  const messages: Message[] = [
    { role: "user", content: "Start task" },
    { role: "assistant", content: "Starting step 1" },
    { role: "user", content: "Continue" },
    { role: "assistant", content: "Completing step 2" }
  ];

  const stepOutputs: StepOutput[] = [
    {
      step_index: 0,
      base_reward: 0.3,
      terminated: false
    },
    {
      step_index: 1,
      base_reward: 0.7,
      terminated: true,
      control_plane_info: { task_completed: true }
    }
  ];

  const evaluationResult: EvaluateResult = {
    score: 0.5,
    reason: "Task completed in 2 steps",
    step_outputs: stepOutputs,
    trajectory_info: {
      duration: 45.2,
      steps: 2,
      termination_reason: "task_completed"
    },
    final_control_plane_info: { task_completed: true }
  };

  return createEvaluationRow(messages, {
    groundTruth: "Task completed successfully",
    evaluationResult,
    inputMetadata: {
      row_id: "trajectory_001",
      session_data: { seed: 123, environment: "gridworld" },
      execution_info: { max_steps: 10, timeout: 60 }
    }
  });
}

// Example 3: With Tool Usage
function createToolUsageExample(): EvaluationRow {
  const messages: Message[] = [
    { role: "user", content: "Search for recent papers on ML" },
    {
      role: "assistant",
      content: "I'll search for recent ML papers.",
      tool_calls: [{
        id: "search_1",
        type: "function",
        function: {
          name: "search_papers",
          arguments: '{"query": "machine learning", "recent": true}'
        }
      }]
    }
  ];

  const tools = [
    {
      type: "function",
      function: {
        name: "search_papers",
        description: "Search academic papers",
        parameters: {
          type: "object",
          properties: {
            query: { type: "string" },
            recent: { type: "boolean" }
          }
        }
      }
    }
  ];

  return createEvaluationRow(messages, {
    tools,
    groundTruth: "Recent ML papers found",
    evaluationResult: {
      score: 0.9,
      reason: "Good tool usage"
    },
    inputMetadata: {
      row_id: "search_001",
      dataset_info: { category: "tool_usage", complexity: "medium" }
    }
  });
}

// Example usage and validation
function demonstrateUsage(): void {
  console.log("=== EvaluationRow Schema Examples ===\n");

  // Per-turn evaluation
  const perTurnRow = createPerTurnExample();
  console.log("1. Per-Turn Evaluation:");
  console.log(`   Valid: ${isEvaluationRow(perTurnRow)}`);
  console.log(`   Is Trajectory: ${isTrajectoryEvaluation(perTurnRow)}`);
  console.log(`   Assistant Messages: ${getAssistantMessages(perTurnRow).length}`);
  console.log(`   Dataset Source: ${getInputMetadata(perTurnRow, 'dataset_info.source', 'unknown')}`);
  console.log();

  // Trajectory evaluation
  const trajectoryRow = createTrajectoryExample();
  console.log("2. Trajectory Evaluation:");
  console.log(`   Valid: ${isEvaluationRow(trajectoryRow)}`);
  console.log(`   Is Trajectory: ${isTrajectoryEvaluation(trajectoryRow)}`);
  console.log(`   Steps: ${trajectoryRow.evaluation_result?.step_outputs?.length || 0}`);
  console.log(`   Environment: ${getInputMetadata(trajectoryRow, 'session_data.environment', 'unknown')}`);
  console.log();

  // Tool usage
  const toolRow = createToolUsageExample();
  console.log("3. Tool Usage:");
  console.log(`   Valid: ${isEvaluationRow(toolRow)}`);
  console.log(`   Has Tools: ${(toolRow.tools?.length || 0) > 0}`);
  console.log(`   Tool Calls: ${toolRow.messages.some(m => m.tool_calls?.length)}`);
  console.log();

  // Validation example
  const invalidData = { messages: "not an array" };
  const validation = validateEvaluationRow(invalidData);
  console.log("4. Validation Example:");
  console.log(`   Valid: ${validation.valid}`);
  console.log(`   Errors: ${validation.errors.join(', ')}`);
}

// Run the demonstration
if (typeof window === 'undefined') {
  // Node.js environment
  demonstrateUsage();
}

export {
  createPerTurnExample,
  createTrajectoryExample,
  createToolUsageExample,
  demonstrateUsage
}; 