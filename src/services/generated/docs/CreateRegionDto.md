# CreateRegionDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**languageCode** | **string** | Código de idioma único que actúa como ID | [default to undefined]
**name** | **string** | Nombre de la región | [default to undefined]
**parentRegionId** | **string** | languageCode de la región padre (opcional) | [optional] [default to undefined]
**timeZone** | **string** | Zona horaria | [optional] [default to undefined]
**defaultFormalityLevel** | **string** | Nivel de formalidad por defecto (opcional) | [optional] [default to undefined]
**notes** | **string** | Notas adicionales (opcional) | [optional] [default to undefined]

## Example

```typescript
import { CreateRegionDto } from './api';

const instance: CreateRegionDto = {
    languageCode,
    name,
    parentRegionId,
    timeZone,
    defaultFormalityLevel,
    notes,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
