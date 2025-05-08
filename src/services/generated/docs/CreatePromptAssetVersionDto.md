# CreatePromptAssetVersionDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**value** | **string** | El valor del asset para esta nueva versión | [default to undefined]
**versionTag** | **string** | Etiqueta de versión (e.g., v1.0.1, v1.1.0). Si no se provee, se podría auto-incrementar o requerir. | [optional] [default to undefined]
**changeMessage** | **string** | Mensaje describiendo los cambios en esta versión. | [optional] [default to undefined]

## Example

```typescript
import { CreatePromptAssetVersionDto } from './api';

const instance: CreatePromptAssetVersionDto = {
    value,
    versionTag,
    changeMessage,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
