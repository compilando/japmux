# TagDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Unique ID of the tag (CUID) | [default to undefined]
**name** | **string** | Unique tag name within the project | [default to undefined]
**description** | **string** | Description of the tag | [default to undefined]
**projectId** | **string** | ID of the project this tag belongs to (CUID) | [default to undefined]

## Example

```typescript
import { TagDto } from './api';

const instance: TagDto = {
    id,
    name,
    description,
    projectId,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
