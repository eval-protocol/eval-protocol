#!/usr/bin/env python3
"""
Script to generate JSON Schema and TypeScript definitions for EvaluationRow
based on the Model Context Protocol standards.
"""

import json
import os
from typing import Any, Dict, List, Optional, Union

# Add the python-sdk to the path so we can import the models
import sys
sys.path.insert(0, '/home/bchen/home/eval_protocol/python-sdk')

from eval_protocol.models import (
    EvaluationRow, Message, MetricResult, StepOutput, EvaluateResult
)
from pydantic import BaseModel


def generate_json_schema() -> Dict[str, Any]:
    """Generate JSON Schema for EvaluationRow and related models."""
    
    # Generate schema for each model
    message_schema = Message.model_json_schema()
    metric_result_schema = MetricResult.model_json_schema()
    step_output_schema = StepOutput.model_json_schema()
    evaluate_result_schema = EvaluateResult.model_json_schema()
    evaluation_row_schema = EvaluationRow.model_json_schema()
    
    # Create a comprehensive schema with all definitions
    full_schema = {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "$id": "https://eval-protocol.com/schema/evaluation-row.json",
        "title": "EvaluationRow",
        "description": "Model Context Protocol compatible schema for evaluation data",
        "type": "object",
        "definitions": {
            "Message": message_schema,
            "MetricResult": metric_result_schema,
            "StepOutput": step_output_schema,
            "EvaluateResult": evaluate_result_schema,
            "EvaluationRow": evaluation_row_schema
        },
        "properties": evaluation_row_schema["properties"],
        "required": evaluation_row_schema.get("required", []),
        "additionalProperties": evaluation_row_schema.get("additionalProperties", True)
    }
    
    return full_schema


def generate_typescript_definitions() -> str:
    """Generate TypeScript definitions for EvaluationRow and related models."""
    
    typescript_defs = '''/**
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
'''
    
    return typescript_defs


def main():
    """Generate all schema files."""
    schema_dir = "/home/bchen/home/eval_protocol/eval-protocol/schema"
    
    # Generate JSON Schema
    json_schema = generate_json_schema()
    with open(os.path.join(schema_dir, "evaluation-row.json"), "w") as f:
        json.dump(json_schema, f, indent=2)
    
    # Generate TypeScript definitions
    typescript_defs = generate_typescript_definitions()
    with open(os.path.join(schema_dir, "evaluation-row.d.ts"), "w") as f:
        f.write(typescript_defs)
    
    # Generate a README for the schema
    readme_content = """# EvaluationRow Schema

This directory contains Model Context Protocol compatible schemas for the EvaluationRow data structure used in the eval-protocol system.

## Files

- `evaluation-row.json`: JSON Schema definition for EvaluationRow and related models
- `evaluation-row.d.ts`: TypeScript type definitions
- `generate_schemas.py`: Python script to regenerate these schemas from Pydantic models

## Usage

### JSON Schema
The JSON Schema can be used for validation in any JSON Schema compatible system:

```json
{
  "$schema": "./evaluation-row.json",
  "messages": [
    {
      "role": "user",
      "content": "Hello, how can I help?"
    }
  ],
  "evaluation_result": {
    "score": 0.85,
    "reason": "Good response quality"
  }
}
```

### TypeScript
Import the type definitions in your TypeScript project:

```typescript
import { EvaluationRow, isEvaluationRow } from './evaluation-row';

const evaluation: EvaluationRow = {
  messages: [
    { role: 'user', content: 'Hello' },
    { role: 'assistant', content: 'Hi there!' }
  ],
  evaluation_result: {
    score: 0.9,
    reason: 'Excellent response'
  }
};

// Validate using type guard
if (isEvaluationRow(data)) {
  console.log('Valid evaluation row');
}
```

## Model Context Protocol Integration

These schemas are designed to be compatible with the Model Context Protocol (MCP) and can be used for:

- Tool call validation in MCP servers
- Data exchange between MCP clients and servers
- Standardized evaluation data format across different MCP implementations

## Regeneration

To regenerate these schemas from the Pydantic models:

```bash
python generate_schemas.py
```
"""
    
    with open(os.path.join(schema_dir, "README.md"), "w") as f:
        f.write(readme_content)
    
    print("Schema files generated successfully!")
    print(f"- JSON Schema: {schema_dir}/evaluation-row.json")
    print(f"- TypeScript: {schema_dir}/evaluation-row.d.ts")
    print(f"- README: {schema_dir}/README.md")


if __name__ == "__main__":
    main()