# CreateOrUpdatePromptTranslationDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**languageCode** | **string** | Language code for the translation (e.g., es-ES, fr-FR, en). Valid BCP 47 language tag. | [default to undefined]
**promptText** | **string** | Translated prompt text for this version and language. Cannot be empty. | [default to undefined]

## Example

```typescript
import { CreateOrUpdatePromptTranslationDto } from './api';

const instance: CreateOrUpdatePromptTranslationDto = {
    languageCode,
    promptText,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
