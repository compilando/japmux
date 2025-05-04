# CreatePromptAssetVersionDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**assetId** | **string** | Key (slug) del asset lógico al que pertenece esta versión | [default to undefined]
**value** | **string** | El valor del asset para esta versión | [default to undefined]
**versionTag** | **string** | Etiqueta de versión (e.g., v1.0.0). Debe ser única por asset. | [optional] [default to 'v1.0.0']
**changeMessage** | **string** | Mensaje describiendo los cambios en esta versión. | [optional] [default to undefined]

## Example

```typescript
import { CreatePromptAssetVersionDto } from './api';

const instance: CreatePromptAssetVersionDto = {
    assetId,
    value,
    versionTag,
    changeMessage,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
