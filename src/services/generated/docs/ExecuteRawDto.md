# ExecuteRawDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**userText** | **string** | The raw text input from the user. | [default to undefined]
**systemPromptName** | **string** | The unique name of the SystemPrompt to use. | [default to undefined]
**aiModelId** | **string** | The unique ID (CUID) of the AIModel to use for execution. | [default to undefined]
**variables** | **object** | Optional variables to substitute in the system prompt. | [optional] [default to undefined]

## Example

```typescript
import { ExecuteRawDto } from './api';

const instance: ExecuteRawDto = {
    userText,
    systemPromptName,
    aiModelId,
    variables,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
