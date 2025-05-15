# PromptAssetStructureDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**key** | **string** | Unique key for the asset in slug-case format. This key is used in {{placeholders}}. | [default to undefined]
**name** | **string** | Descriptive name for the asset. | [default to undefined]
**value** | **string** | The original extracted value for the asset. | [default to undefined]
**changeMessage** | **string** | Change message for this asset version. | [default to undefined]
**translations** | [**Array&lt;AssetTranslationStructureDto&gt;**](AssetTranslationStructureDto.md) | Translations for the asset value. | [default to undefined]

## Example

```typescript
import { PromptAssetStructureDto } from './api';

const instance: PromptAssetStructureDto = {
    key,
    name,
    value,
    changeMessage,
    translations,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
