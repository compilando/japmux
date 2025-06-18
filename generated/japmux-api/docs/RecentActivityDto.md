# RecentActivityDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | ID único de la actividad | [default to undefined]
**timestamp** | **string** | Timestamp de cuando ocurrió la actividad | [default to undefined]
**action** | **string** | Tipo de acción realizada | [default to undefined]
**entityType** | **string** | Tipo de entidad afectada | [default to undefined]
**entityId** | **string** | ID de la entidad afectada | [default to undefined]
**userId** | **string** | ID del usuario que realizó la acción | [default to undefined]
**userName** | **string** | Nombre del usuario que realizó la acción | [default to undefined]
**projectId** | **string** | ID del proyecto relacionado | [default to undefined]
**projectName** | **string** | Nombre del proyecto relacionado | [default to undefined]
**details** | **object** | Detalles adicionales de la actividad | [optional] [default to undefined]
**changes** | [**RecentActivityDtoChanges**](RecentActivityDtoChanges.md) |  | [optional] [default to undefined]

## Example

```typescript
import { RecentActivityDto } from './api';

const instance: RecentActivityDto = {
    id,
    timestamp,
    action,
    entityType,
    entityId,
    userId,
    userName,
    projectId,
    projectName,
    details,
    changes,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
