# CreateCulturalDataDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Unique ID for this cultural data (slug format) | [default to undefined]
**regionId** | **string** | Associated region ID (xx-XX language code) | [default to undefined]
**formalityLevel** | **number** | Formality level (optional) | [optional] [default to undefined]
**style** | **string** | Communication style (optional) | [optional] [default to undefined]
**considerations** | **string** | Cultural considerations (optional) | [optional] [default to undefined]
**notes** | **string** | Additional notes (optional) | [optional] [default to undefined]

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
