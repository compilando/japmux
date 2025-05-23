# ProjectDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Unique identifier for the project | [default to undefined]
**name** | **string** | Name of the project | [default to undefined]
**description** | **string** | Optional description of the project | [optional] [default to undefined]
**tenantId** | **string** | ID of the tenant this project belongs to | [default to undefined]
**ownerUserId** | **string** | ID of the user who owns this project | [default to undefined]
**createdAt** | **string** | Creation timestamp | [default to undefined]
**updatedAt** | **string** | Last update timestamp | [default to undefined]

## Example

```typescript
import { ProjectDto } from './api';

const instance: ProjectDto = {
    id,
    name,
    description,
    tenantId,
    ownerUserId,
    createdAt,
    updatedAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
