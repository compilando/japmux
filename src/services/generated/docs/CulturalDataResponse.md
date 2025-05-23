# CulturalDataResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**key** | **string** | Unique key for the cultural data within the project | [default to undefined]
**regionId** | **string** | ID (CUID) of the Region this data applies to | [default to undefined]
**style** | **string** | The style of communication | [default to undefined]
**notes** | **string** | Additional notes | [optional] [default to undefined]
**region** | [**CreateRegionDto**](CreateRegionDto.md) |  | [default to undefined]
**projectId** | **string** |  | [default to undefined]

## Example

```typescript
import { CulturalDataResponse } from './api';

const instance: CulturalDataResponse = {
    key,
    regionId,
    style,
    notes,
    region,
    projectId,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
