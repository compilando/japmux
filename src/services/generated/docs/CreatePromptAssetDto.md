# CreatePromptAssetDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**key** | **string** | Clave única identificadora del asset (e.g., saludo_formal_es) | [default to undefined]
**name** | **string** | Nombre descriptivo del asset | [default to undefined]
**category** | **string** | Categoría para organizar assets (e.g., Saludos, Despedidas) | [optional] [default to undefined]
**initialValue** | **string** | Valor inicial del asset para la primera versión (1.0.0) | [default to undefined]
**initialChangeMessage** | **string** | Mensaje de cambio para la primera versión | [optional] [default to undefined]
**tenantId** | **string** | ID del tenant al que pertenece este asset | [default to undefined]
**initialTranslations** | [**Array&lt;InitialTranslationDto&gt;**](InitialTranslationDto.md) | Traducciones iniciales para diferentes idiomas | [optional] [default to undefined]

## Example

```typescript
import { CreatePromptAssetDto } from './api';

const instance: CreatePromptAssetDto = {
    key,
    name,
    category,
    initialValue,
    initialChangeMessage,
    tenantId,
    initialTranslations,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
