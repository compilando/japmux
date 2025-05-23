# ExecuteLlmDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**modelId** | **string** | ID del modelo de IA a utilizar | [default to undefined]
**promptId** | **string** | ID del prompt a ejecutar | [optional] [default to undefined]
**projectId** | **string** | ID del proyecto al que pertenece el prompt | [optional] [default to undefined]
**versionTag** | **string** | Versión del prompt a ejecutar | [optional] [default to 'latest']
**languageCode** | **string** | Código de idioma para el prompt | [optional] [default to undefined]
**variables** | **object** | Variables para sustituir en el prompt | [optional] [default to undefined]
**promptText** | **string** | Texto del prompt a ejecutar (solo si no se proporciona promptId) | [optional] [default to undefined]

## Example

```typescript
import { ExecuteLlmDto } from './api';

const instance: ExecuteLlmDto = {
    modelId,
    promptId,
    projectId,
    versionTag,
    languageCode,
    variables,
    promptText,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
