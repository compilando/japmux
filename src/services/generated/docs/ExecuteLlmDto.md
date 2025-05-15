# ExecuteLlmDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**modelId** | **string** | ID of the AIModel to use (from the AIModel table) | [default to undefined]
**promptText** | **string** | The complete prompt text already processed and ready to send to the LLM | [default to undefined]
**variables** | **object** | Original variables used to assemble the prompt (optional, for logging/context) | [optional] [default to undefined]

## Example

```typescript
import { ExecuteLlmDto } from './api';

const instance: ExecuteLlmDto = {
    modelId,
    promptText,
    variables,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
