# AiModelResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Unique CUID of the AI model | [default to undefined]
**name** | **string** | Unique name for the AI model within the project | [default to undefined]
**provider** | **string** | Provider of the AI model | [optional] [default to undefined]
**description** | **string** | Optional description for the AI model | [optional] [default to undefined]
**apiIdentifier** | **string** | Identifier used for API calls | [optional] [default to undefined]
**apiKeyEnvVar** | **string** | Environment variable name for the API Key | [optional] [default to undefined]
**temperature** | **number** | Default temperature setting | [optional] [default to undefined]
**maxTokens** | **number** | Default max tokens setting | [optional] [default to undefined]
**supportsJson** | **boolean** | Whether the model reliably supports JSON output mode | [optional] [default to undefined]
**contextWindow** | **number** | Maximum context window size in tokens | [optional] [default to undefined]
**createdAt** | **string** | Timestamp of creation | [default to undefined]
**projectId** | **string** | ID of the project this model belongs to | [default to undefined]

## Example

```typescript
import { AiModelResponseDto } from './api';

const instance: AiModelResponseDto = {
    id,
    name,
    provider,
    description,
    apiIdentifier,
    apiKeyEnvVar,
    temperature,
    maxTokens,
    supportsJson,
    contextWindow,
    createdAt,
    projectId,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
