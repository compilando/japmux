# UpdatePromptVersionDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**promptText** | **string** | Texto BASE del prompt para esta nueva versión. | [optional] [default to undefined]
**changeMessage** | **string** | Mensaje describiendo los cambios en esta versión. | [optional] [default to undefined]
**assetLinks** | [**Array&lt;AssetVersionLinkDto&gt;**](AssetVersionLinkDto.md) | Lista de versiones de assets a vincular a esta versión del prompt. | [optional] [default to undefined]
**initialTranslations** | [**Array&lt;InitialTranslationDto&gt;**](InitialTranslationDto.md) | Traducciones iniciales opcionales para esta nueva versión. | [optional] [default to undefined]

## Example

```typescript
import { UpdatePromptVersionDto } from './api';

const instance: UpdatePromptVersionDto = {
    promptText,
    changeMessage,
    assetLinks,
    initialTranslations,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
