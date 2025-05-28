# UpdatePromptAssetDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**category** | **string** | Categoría para organizar assets (e.g., Saludos, Despedidas) | [optional] [default to undefined]
**tenantId** | **string** | ID del tenant al que pertenece este asset | [optional] [default to undefined]
**initialTranslations** | [**Array&lt;InitialTranslationDto&gt;**](InitialTranslationDto.md) | Traducciones iniciales para diferentes idiomas | [optional] [default to undefined]
**enabled** | **boolean** | Activa o desactiva el asset | [optional] [default to undefined]

## Example

```typescript
import { UpdatePromptAssetDto } from './api';

const instance: UpdatePromptAssetDto = {
    category,
    tenantId,
    initialTranslations,
    enabled,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
