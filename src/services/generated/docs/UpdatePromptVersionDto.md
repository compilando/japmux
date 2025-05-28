# UpdatePromptVersionDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**promptText** | **string** | El valor/texto del prompt para esta nueva versión | [optional] [default to undefined]
**versionTag** | **string** | Tag de versión para esta nueva versión (e.g., 1.0.0, 1.0.0-beta.1). Debe ser único por prompt. | [optional] [default to undefined]
**languageCode** | **string** | Código de idioma para esta versión (e.g., en-US, es-ES). Se obtiene del listado de regiones del proyecto. | [optional] [default to undefined]
**changeMessage** | **string** | Mensaje describiendo los cambios en esta versión. | [optional] [default to undefined]
**initialTranslations** | [**Array&lt;InitialTranslationDto&gt;**](InitialTranslationDto.md) | Optional initial translations for this new version. | [optional] [default to undefined]

## Example

```typescript
import { UpdatePromptVersionDto } from './api';

const instance: UpdatePromptVersionDto = {
    promptText,
    versionTag,
    languageCode,
    changeMessage,
    initialTranslations,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
