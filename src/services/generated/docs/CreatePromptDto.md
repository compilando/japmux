# CreatePromptDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | Nombre único del prompt (usado como ID) | [default to undefined]
**description** | **string** | Descripción del propósito del prompt. | [optional] [default to undefined]
**tacticId** | **string** | ID (nombre) de la táctica conversacional asociada. | [optional] [default to undefined]
**tags** | **Set&lt;string&gt;** | Lista de nombres de etiquetas a asociar. | [optional] [default to undefined]
**promptText** | **string** | Texto base del prompt para la primera versión (v1.0.0) | [default to undefined]
**initialTranslations** | [**Array&lt;InitialTranslationDto&gt;**](InitialTranslationDto.md) | Traducciones iniciales opcionales para la primera versión | [optional] [default to undefined]

## Example

```typescript
import { CreatePromptDto } from './api';

const instance: CreatePromptDto = {
    name,
    description,
    tacticId,
    tags,
    promptText,
    initialTranslations,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
