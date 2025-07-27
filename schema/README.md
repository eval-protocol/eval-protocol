# EvaluationRow Schema

This directory contains Model Context Protocol compatible schemas for the EvaluationRow data structure used in the eval-protocol system.

## Files

- `evaluation-row.json`: JSON Schema definition for EvaluationRow and related models
- `evaluation-row.d.ts`: TypeScript type definitions (declarations only)
- `evaluation-row.ts`: TypeScript implementation with helper functions
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
Import the type definitions and helper functions in your TypeScript project:

```typescript
import { EvaluationRow, isEvaluationRow, createEvaluationRow } from './evaluation-row';

const evaluation: EvaluationRow = createEvaluationRow([
  { role: 'user', content: 'Hello' },
  { role: 'assistant', content: 'Hi there!' }
], {
  evaluationResult: {
    score: 0.9,
    reason: 'Excellent response'
  }
});

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

## Unified Evaluation Metadata

This schema implements the unified evaluation metadata proposal, providing:

1. **Clean Structure**: Only five main fields in `EvaluationRow` for maximum clarity
2. **Flexible Input Metadata**: Single `input_metadata` field can contain any relevant context
3. **Unified Data Flow**: Single data structure handles both per-turn and trajectory evaluation
4. **Developer Friendly**: Clear helper methods and intuitive data access patterns
5. **Type Safe**: Full validation and type hints throughout

### EvaluationRow Structure

- `messages`: List of conversation messages (required)
- `tools`: Available tools/functions that were provided to the agent (optional)
- `input_metadata`: Metadata related to the input (dataset info, model config, session data, etc.) (optional)
- `ground_truth`: Ground truth reference for this evaluation (optional)
- `evaluation_result`: The evaluation result for this row/trajectory (optional)

### Enhanced Models

The schema includes enhanced models for comprehensive evaluation:

- `EvaluateResult`: Unified result structure supporting both per-turn and trajectory evaluation
- `StepOutput`: Per-step rewards with termination and control plane information
- `MetricResult`: Detailed metric evaluation results with validity flags
- `Message`: OpenAI-compatible message structure with tool call support
