# CreateTacticDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | Nombre único de la táctica (formato slug: minúsculas, guiones) | [default to undefined]
**regionId** | **string** | Código de idioma de la región asociada (e.g., es-ES, opcional) | [optional] [default to undefined]
**culturalDataId** | **string** | ID (slug) de los datos culturales asociados (opcional) | [optional] [default to undefined]
**tacticsConfig** | **object** | Configuración específica de la táctica en formato JSON (opcional) | [optional] [default to undefined]
**projectId** | **string** | ID del proyecto al que pertenece la táctica. | [optional] [default to undefined]

## Example

```typescript
import { CreateTacticDto } from './api';

const instance: CreateTacticDto = {
    name,
    regionId,
    culturalDataId,
    tacticsConfig,
    projectId,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
