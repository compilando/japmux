# CreateRegionDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**languageCode** | **string** | Unique language code acting as ID | [default to undefined]
**name** | **string** | Name of the region | [default to undefined]
**parentRegionId** | **string** | languageCode of the parent region (optional) | [optional] [default to undefined]
**timeZone** | **string** | Time zone | [optional] [default to undefined]
**notes** | **string** | Default formality level (optional) | [optional] [default to undefined]

## Example

```typescript
import { CreateRegionDto } from './api';

const instance: CreateRegionDto = {
    languageCode,
    name,
    parentRegionId,
    timeZone,
    notes,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
