# UpdateRegionDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | Nombre de la región | [optional] [default to undefined]
**parentRegionId** | **string** | languageCode de la región padre (opcional) | [optional] [default to undefined]
**timeZone** | **string** | Zona horaria | [optional] [default to undefined]
**defaultFormalityLevel** | **string** | Nivel de formalidad por defecto (opcional) | [optional] [default to undefined]
**notes** | **string** | Notas adicionales (opcional) | [optional] [default to undefined]

## Example

```typescript
import { UpdateRegionDto } from './api';

const instance: UpdateRegionDto = {
    name,
    parentRegionId,
    timeZone,
    defaultFormalityLevel,
    notes,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
