# UpdatePromptVersionDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**promptText** | **string** | BASE prompt text for this new version. | [optional] [default to undefined]
**changeMessage** | **string** | Message describing the changes in this version. | [optional] [default to undefined]
**assetLinks** | [**Array&lt;AssetVersionLinkDto&gt;**](AssetVersionLinkDto.md) | List of asset versions to link to this prompt version. | [optional] [default to undefined]
**initialTranslations** | [**Array&lt;InitialTranslationDto&gt;**](InitialTranslationDto.md) | Optional initial translations for this new version. | [optional] [default to undefined]

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
