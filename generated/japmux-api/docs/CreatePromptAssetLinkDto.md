# CreatePromptAssetLinkDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**promptVersionId** | **string** | ID de la PromptVersion a la que se vincula el asset. | [default to undefined]
**assetVersionId** | **string** | ID de la PromptAssetVersion que se vincula. | [default to undefined]
**usageContext** | **string** | Contexto de uso o propósito de este asset en el prompt. | [optional] [default to undefined]
**position** | **number** | Orden posicional del asset dentro del prompt (si aplica). | [optional] [default to undefined]
**insertionLogic** | **string** | Lógica de inserción condicional (formato a definir). | [optional] [default to undefined]
**isRequired** | **boolean** | Indica si el asset es requerido para el prompt (default: true). | [optional] [default to undefined]

## Example

```typescript
import { CreatePromptAssetLinkDto } from './api';

const instance: CreatePromptAssetLinkDto = {
    promptVersionId,
    assetVersionId,
    usageContext,
    position,
    insertionLogic,
    isRequired,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
