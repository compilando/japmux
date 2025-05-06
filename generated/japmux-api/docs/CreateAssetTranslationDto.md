# CreateAssetTranslationDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**versionId** | **string** | ID de la versión del asset a la que pertenece esta traducción | [default to undefined]
**languageCode** | **string** | Código de idioma para esta traducción (formato xx-XX) | [default to undefined]
**value** | **string** | Valor del asset traducido a este idioma | [default to undefined]

## Example

```typescript
import { CreateAssetTranslationDto } from './api';

const instance: CreateAssetTranslationDto = {
    versionId,
    languageCode,
    value,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
