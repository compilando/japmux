# UpdateRegionDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | Name of the region | [optional] [default to undefined]
**parentRegionId** | **string** | languageCode of the parent region (optional) | [optional] [default to undefined]
**timeZone** | **string** | Time zone | [optional] [default to undefined]
**defaultFormalityLevel** | **string** | Default formality level (optional) | [optional] [default to undefined]
**notes** | **string** | Additional notes (optional) | [optional] [default to undefined]

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
