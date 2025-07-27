/**
 * Model Context Protocol TypeScript implementations for EvaluationRow
 * Auto-generated from Pydantic models
 */

import type { EvaluationRow, Message } from './evaluation-row.d';

/**
 * Type guard to check if an object is a valid EvaluationRow
 */
export function isEvaluationRow(obj: any): obj is EvaluationRow {
  return (
    obj &&
    typeof obj === 'object' &&
    Array.isArray(obj.messages) &&
    obj.messages.every((msg: any) => 
      msg &&
      typeof msg === 'object' &&
      typeof msg.role === 'string'
    )
  );
}

/**
 * Type guard to check if this represents a trajectory evaluation
 */
export function isTrajectoryEvaluation(row: EvaluationRow): boolean {
  return (
    row.evaluation_result !== undefined &&
    row.evaluation_result.step_outputs !== undefined &&
    row.evaluation_result.step_outputs.length > 0
  );
}

/**
 * Helper function to get assistant messages from an EvaluationRow
 */
export function getAssistantMessages(row: EvaluationRow): Message[] {
  return row.messages.filter(msg => msg.role === 'assistant');
}

/**
 * Helper function to get user messages from an EvaluationRow
 */
export function getUserMessages(row: EvaluationRow): Message[] {
  return row.messages.filter(msg => msg.role === 'user');
}

/**
 * Helper function to get input metadata value
 */
export function getInputMetadata(row: EvaluationRow, key: string, defaultValue?: any): any {
  return row.input_metadata?.[key] ?? defaultValue;
}

/**
 * Helper function to get the conversation length
 */
export function getConversationLength(row: EvaluationRow): number {
  return row.messages.length;
}

/**
 * Helper to create a basic EvaluationRow
 */
export function createEvaluationRow(
  messages: Message[], 
  options?: {
    tools?: Array<Record<string, any>>;
    inputMetadata?: Record<string, any>;
    groundTruth?: string;
    evaluationResult?: EvaluationRow['evaluation_result'];
  }
): EvaluationRow {
  return {
    messages,
    tools: options?.tools,
    input_metadata: options?.inputMetadata,
    ground_truth: options?.groundTruth,
    evaluation_result: options?.evaluationResult
  };
}

/**
 * Helper to validate that required fields are present
 */
export function validateEvaluationRow(row: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!row) {
    errors.push('EvaluationRow is null or undefined');
    return { valid: false, errors };
  }
  
  if (!Array.isArray(row.messages)) {
    errors.push('messages field is required and must be an array');
  } else if (row.messages.length === 0) {
    errors.push('messages array cannot be empty');
  } else {
    row.messages.forEach((msg: any, index: number) => {
      if (!msg || typeof msg !== 'object') {
        errors.push(`messages[${index}] must be an object`);
      } else if (typeof msg.role !== 'string') {
        errors.push(`messages[${index}].role must be a string`);
      }
    });
  }
  
  return { valid: errors.length === 0, errors };
}
