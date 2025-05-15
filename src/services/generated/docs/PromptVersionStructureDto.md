# PromptVersionStructureDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**promptText** | **string** | Core prompt text, potentially including {{asset_key}} placeholders. | [default to undefined]
**changeMessage** | **string** | Change message for this version. | [default to undefined]
**assets** | **Array&lt;string&gt;** | Array of asset keys (slug-case) used in this prompt version. These keys must correspond to assets defined in the main \&quot;assets\&quot; list. | [default to undefined]
**translations** | [**Array&lt;PromptVersionTranslationDto&gt;**](PromptVersionTranslationDto.md) | Translations for the prompt text. | [default to undefined]

## Example

```typescript
import { PromptVersionStructureDto } from './api';

const instance: PromptVersionStructureDto = {
    promptText,
    changeMessage,
    assets,
    translations,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
