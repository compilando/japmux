# UpdatePromptDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | New name for the prompt. | [optional] [default to undefined]
**description** | **string** | New description of the prompt\&#39;s purpose. | [optional] [default to undefined]
**type** | **string** | New type for the prompt. | [optional] [default to undefined]
**tagIds** | **Array&lt;string&gt;** | Complete list of Tag IDs to associate (replaces existing ones). Empty array to remove all. | [optional] [default to undefined]

## Example

```typescript
import { UpdatePromptDto } from './api';

const instance: UpdatePromptDto = {
    name,
    description,
    type,
    tagIds,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
