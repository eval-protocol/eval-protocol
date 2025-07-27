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
export declare function isEvaluationRow(obj: any): obj is EvaluationRow;

/**
 * Type guard to check if this represents a trajectory evaluation
 */
export declare function isTrajectoryEvaluation(row: EvaluationRow): boolean;

/**
 * Helper function to get assistant messages from an EvaluationRow
 */
export declare function getAssistantMessages(row: EvaluationRow): Message[];

/**
 * Helper function to get user messages from an EvaluationRow
 */
export declare function getUserMessages(row: EvaluationRow): Message[];

/**
 * Helper function to get input metadata value
 */
export declare function getInputMetadata(row: EvaluationRow, key: string, defaultValue?: any): any;
