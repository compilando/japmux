# LoadPromptStructureDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**prompt** | [**PromptMetaDto**](PromptMetaDto.md) | Metadata for the prompt to be created. | [default to undefined]
**version** | [**PromptVersionStructureDto**](PromptVersionStructureDto.md) | Structure for the initial prompt version. | [default to undefined]
**languageCode** | **string** | Código de idioma para la versión inicial (e.g., en-US, es-ES). Se obtiene del listado de regiones del proyecto. | [default to undefined]
**assets** | [**Array&lt;PromptAssetStructureDto&gt;**](PromptAssetStructureDto.md) | List of assets to be created and associated with the prompt (conceptually via placeholders). | [default to undefined]
**tags** | **Array&lt;string&gt;** | Optional list of tag names to associate with the prompt. | [optional] [default to undefined]

## Example

```typescript
import { LoadPromptStructureDto } from './api';

const instance: LoadPromptStructureDto = {
    prompt,
    version,
    languageCode,
    assets,
    tags,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
