# RegionDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Unique identifier for the region | [default to undefined]
**name** | **string** | Name of the region | [default to undefined]
**description** | **string** | Optional description of the region | [optional] [default to undefined]
**projectId** | **string** | ID of the project this region belongs to | [default to undefined]
**languageCode** | **string** | Language code for the region | [default to undefined]
**parentRegionId** | **string** | ID of the parent region, if any | [optional] [default to undefined]
**timeZone** | **string** | Time zone for the region | [default to undefined]
**notes** | **string** | Optional notes about the region | [optional] [default to undefined]
**createdAt** | **string** | Creation timestamp | [default to undefined]
**updatedAt** | **string** | Last update timestamp | [default to undefined]

## Example

```typescript
import { RegionDto } from './api';

const instance: RegionDto = {
    id,
    name,
    description,
    projectId,
    languageCode,
    parentRegionId,
    timeZone,
    notes,
    createdAt,
    updatedAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
