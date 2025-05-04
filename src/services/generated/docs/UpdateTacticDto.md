# UpdateTacticDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**tacticsConfig** | **string** | Nueva configuración específica de la táctica (e.g., JSON string) | [optional] [default to undefined]
**regionId** | **string** | Nuevo código de idioma de la región asociada, o null para desasociar. | [optional] [default to undefined]
**culturalDataId** | **string** | Nuevo ID de los datos culturales asociados, o null para desasociar. | [optional] [default to undefined]
**projectId** | **string** | Nuevo ID del proyecto asociado, o null para desasociar. | [optional] [default to undefined]

## Example

```typescript
import { UpdateTacticDto } from './api';

const instance: UpdateTacticDto = {
    tacticsConfig,
    regionId,
    culturalDataId,
    projectId,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
