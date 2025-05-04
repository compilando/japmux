# CreatePromptTranslationDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**versionId** | **string** | ID de la versión del prompt a la que pertenece esta traducción | [default to undefined]
**languageCode** | **string** | Código de idioma para esta traducción (formato xx-XX) | [default to undefined]
**promptText** | **string** | Texto del prompt traducido a este idioma | [default to undefined]

## Example

```typescript
import { CreatePromptTranslationDto } from './api';

const instance: CreatePromptTranslationDto = {
    versionId,
    languageCode,
    promptText,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
