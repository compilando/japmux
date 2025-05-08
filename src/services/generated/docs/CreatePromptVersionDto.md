# CreatePromptVersionDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**promptText** | **string** | BASE prompt text for this new version. | [default to undefined]
**versionTag** | **string** | Unique tag for this version within the prompt (e.g., v1.1.0, beta-feature-x). | [default to undefined]
**changeMessage** | **string** | Message describing the changes in this version. | [optional] [default to undefined]
**assetLinks** | [**Array&lt;AssetVersionLinkDto&gt;**](AssetVersionLinkDto.md) | List of asset versions to link to this prompt version. | [default to undefined]
**initialTranslations** | [**Array&lt;InitialTranslationDto&gt;**](InitialTranslationDto.md) | Optional initial translations for this new version. | [optional] [default to undefined]

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
