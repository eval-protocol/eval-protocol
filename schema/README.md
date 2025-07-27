# EvaluationRow Schema

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
