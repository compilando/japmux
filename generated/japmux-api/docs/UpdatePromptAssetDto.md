# UpdatePromptAssetDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | Nombre descriptivo del asset | [optional] [default to undefined]
**type** | **string** | Tipo de asset (e.g., texto, json, lista) | [optional] [default to undefined]
**description** | **string** | Descripción más detallada del propósito del asset | [optional] [default to undefined]
**category** | **string** | Categoría para organizar assets (e.g., Saludos, Despedidas) | [optional] [default to undefined]
**enabled** | **boolean** | Activa o desactiva el asset | [optional] [default to undefined]

## Example

```typescript
import { UpdatePromptAssetDto } from './api';

const instance: UpdatePromptAssetDto = {
    name,
    type,
    description,
    category,
    enabled,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
