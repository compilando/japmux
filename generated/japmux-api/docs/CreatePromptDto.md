# CreatePromptDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | Unique prompt name (used as ID) | [default to undefined]
**description** | **string** | Description of the prompt\&#39;s purpose. | [optional] [default to undefined]
**tags** | **Set&lt;string&gt;** | List of tag names to associate. | [optional] [default to undefined]
**type** | **object** | The type of prompt | [default to undefined]
**promptText** | **string** | Base prompt text for the first version (1.0.0) | [default to undefined]
**initialTranslations** | [**Array&lt;InitialTranslationDto&gt;**](InitialTranslationDto.md) | Optional initial translations for the first version | [optional] [default to undefined]

## Example

```typescript
import { CreatePromptDto } from './api';

const instance: CreatePromptDto = {
    name,
    description,
    tags,
    type,
    promptText,
    initialTranslations,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
