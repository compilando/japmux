# CreateCulturalDataDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | ID único para estos datos culturales (formato slug) | [default to undefined]
**regionId** | **string** | ID de la región asociada (código de idioma xx-XX) | [default to undefined]
**formalityLevel** | **number** | Nivel de formalidad (opcional) | [optional] [default to undefined]
**style** | **string** | Estilo de comunicación (opcional) | [optional] [default to undefined]
**considerations** | **string** | Consideraciones culturales (opcional) | [optional] [default to undefined]
**notes** | **string** | Notas adicionales (opcional) | [optional] [default to undefined]

## Example

```typescript
import { CreateCulturalDataDto } from './api';

const instance: CreateCulturalDataDto = {
    id,
    regionId,
    formalityLevel,
    style,
    considerations,
    notes,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
