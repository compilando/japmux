# CreatePromptAssetVersionDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**value** | **string** | El valor del asset para esta nueva versión | [default to undefined]
**versionTag** | **string** | Etiqueta de versión (e.g., 1.0.1, 1.1.0). Si no se provee, se podría auto-incrementar o requerir. | [optional] [default to undefined]
**changeMessage** | **string** | Mensaje describiendo los cambios en esta versión. | [optional] [default to undefined]
**languageCode** | **string** | Código de idioma para la versión del asset (e.g., en-US, es-ES). Se obtiene del listado de regiones del proyecto. | [default to undefined]
**translations** | [**Array&lt;AssetTranslationDto&gt;**](AssetTranslationDto.md) | Traducciones para esta versión del asset. | [optional] [default to undefined]

## Example

```typescript
import { CreatePromptAssetVersionDto } from './api';

const instance: CreatePromptAssetVersionDto = {
    value,
    versionTag,
    changeMessage,
    languageCode,
    translations,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
