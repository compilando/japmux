# UpdatePromptDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**description** | **string** | New description of the prompt\&#39;s purpose. | [optional] [default to undefined]
**tagIds** | **Array&lt;string&gt;** | Complete list of Tag IDs to associate (replaces existing ones). Empty array to remove all. | [optional] [default to undefined]

## Example

```typescript
import { UpdatePromptDto } from './api';

const instance: UpdatePromptDto = {
    description,
    tagIds,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
