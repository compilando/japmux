# UpdatePromptVersionDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**promptText** | **string** | El valor/texto del prompt para esta nueva versión | [optional] [default to undefined]
**changeMessage** | **string** | Mensaje describiendo los cambios en esta versión. | [optional] [default to undefined]
**initialTranslations** | [**Array&lt;InitialTranslationDto&gt;**](InitialTranslationDto.md) | Optional initial translations for this new version. | [optional] [default to undefined]

## Example

```typescript
import { UpdatePromptVersionDto } from './api';

const instance: UpdatePromptVersionDto = {
    promptText,
    changeMessage,
    initialTranslations,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
