# CreatePromptAssetDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**key** | **string** | Clave única identificadora del asset (e.g., saludo_formal_es) | [default to undefined]
**name** | **string** | Nombre descriptivo del asset | [default to undefined]
**type** | **string** | Tipo de asset (e.g., texto, json, lista) | [optional] [default to undefined]
**description** | **string** | Descripción más detallada del propósito del asset | [optional] [default to undefined]
**category** | **string** | Categoría para organizar assets (e.g., Saludos, Despedidas) | [optional] [default to undefined]
**initialValue** | **string** | Valor inicial del asset para la primera versión (v1.0.0) | [default to undefined]
**initialChangeMessage** | **string** | Mensaje de cambio para la primera versión | [optional] [default to undefined]
**projectId** | **string** | ID opcional del proyecto al que pertenece el asset | [optional] [default to undefined]

## Example

```typescript
import { CreatePromptAssetDto } from './api';

const instance: CreatePromptAssetDto = {
    key,
    name,
    type,
    description,
    category,
    initialValue,
    initialChangeMessage,
    projectId,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
