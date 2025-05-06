# UpdateSystemPromptDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | Unique name/identifier for the system prompt | [optional] [default to undefined]
**description** | **string** | Optional description of the prompt\&#39;s purpose | [optional] [default to undefined]
**promptText** | **string** | The actual text content of the system prompt | [optional] [default to undefined]
**category** | **string** | Optional category for grouping prompts | [optional] [default to undefined]

## Example

```typescript
import { UpdateSystemPromptDto } from './api';

const instance: UpdateSystemPromptDto = {
    name,
    description,
    promptText,
    category,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
