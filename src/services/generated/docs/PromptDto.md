# PromptDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | The unique identifier (slug) of the prompt. | [default to undefined]
**name** | **string** | The name of the prompt. | [default to undefined]
**description** | **string** | Optional description for the prompt. | [optional] [default to undefined]
**projectId** | **string** | The ID of the project this prompt belongs to. | [default to undefined]

## Example

```typescript
import { PromptDto } from './api';

const instance: PromptDto = {
    id,
    name,
    description,
    projectId,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
