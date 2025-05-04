# ExecuteLlmDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**modelId** | **string** | ID del AIModel a utilizar (de la tabla AIModel) | [default to undefined]
**promptText** | **string** | El texto completo del prompt ya procesado y listo para enviar al LLM | [default to undefined]
**variables** | **object** | Variables originales usadas para ensamblar el prompt (opcional, para logging/contexto) | [optional] [default to undefined]

## Example

```typescript
import { ExecuteLlmDto } from './api';

const instance: ExecuteLlmDto = {
    modelId,
    promptText,
    variables,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
