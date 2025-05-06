# UpdatePromptDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**description** | **string** | Nueva descripción del propósito del prompt. | [optional] [default to undefined]
**tagIds** | **Array&lt;string&gt;** | Lista completa de IDs de etiquetas a asociar (reemplaza las existentes). Array vacío para quitar todas. | [optional] [default to undefined]

## Example

```typescript
import { UpdatePromptDto } from './api';

const instance: UpdatePromptDto = {
    description,
    tagIds,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
