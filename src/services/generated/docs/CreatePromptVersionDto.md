# CreatePromptVersionDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**promptText** | **string** | Texto BASE del prompt para esta nueva versión. | [default to undefined]
**versionTag** | **string** | Etiqueta única para esta versión dentro del prompt (e.g., v1.1.0, beta-feature-x). | [default to undefined]
**changeMessage** | **string** | Mensaje describiendo los cambios en esta versión. | [optional] [default to undefined]
**assetLinks** | [**Array&lt;AssetVersionLinkDto&gt;**](AssetVersionLinkDto.md) | Lista de versiones de assets a vincular a esta versión del prompt. | [default to undefined]
**initialTranslations** | [**Array&lt;InitialTranslationDto&gt;**](InitialTranslationDto.md) | Traducciones iniciales opcionales para esta nueva versión. | [optional] [default to undefined]

## Example

```typescript
import { CreatePromptVersionDto } from './api';

const instance: CreatePromptVersionDto = {
    promptText,
    versionTag,
    changeMessage,
    assetLinks,
    initialTranslations,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
