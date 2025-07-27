/**
 * Model Context Protocol TypeScript definitions for EvaluationRow
 * Auto-generated from Pydantic models
 */

/**
 * Chat message model compatible with OpenAI's interface
 */
export interface Message {
  role: string;
  content?: string;
  name?: string;
  tool_call_id?: string;
  tool_calls?: Array<{
    id: string;
    type: 'function';
    function: {
      name: string;
      arguments: string;
    };
  }>;
  function_call?: {
    name: string;
    arguments: string;
  };
}

/**
 * Result of a single metric evaluation
 */
export interface MetricResult {
  is_score_valid: boolean;
  score: number;
  reason: string;
}

/**
 * Defines the base reward and other metrics for a single conceptual step
 */
export interface StepOutput {
  step_index: number | string;
  base_reward: number;
  terminated?: boolean;
  control_plane_info?: Record<string, any>;
  metrics?: Record<string, any>;
  reason?: string;
}

/**
 * The complete result of an evaluator
 */
export interface EvaluateResult {
  score: number;
  is_score_valid?: boolean;
  reason?: string;
  metrics?: Record<string, MetricResult>;
  step_outputs?: StepOutput[];
  error?: string;
  trajectory_info?: Record<string, any>;
  final_control_plane_info?: Record<string, any>;
}

/**
 * Unified data structure for a single evaluation unit
 */
export interface EvaluationRow {
  messages: Message[];
  tools?: Array<Record<string, any>>;
  input_metadata?: Record<string, any>;
  ground_truth?: string;
  evaluation_result?: EvaluateResult;
}

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
