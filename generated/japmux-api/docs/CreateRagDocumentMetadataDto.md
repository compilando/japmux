# CreateRagDocumentMetadataDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**regionId** | **string** | ID de la región asociada (opcional) | [optional] [default to undefined]
**documentName** | **string** | Nombre del documento RAG | [default to undefined]
**category** | **string** | Categoría (opcional) | [optional] [default to undefined]
**complianceReviewed** | **boolean** | Indica si ha sido revisado por compliance | [optional] [default to false]
**piiRiskLevel** | **string** | Nivel de riesgo PII (Información Personal Identificable) (opcional) | [optional] [default to undefined]
**lastReviewedBy** | **string** | Identificador de quién lo revisó por última vez (opcional) | [optional] [default to undefined]

## Example

```typescript
import { CreateRagDocumentMetadataDto } from './api';

const instance: CreateRagDocumentMetadataDto = {
    regionId,
    documentName,
    category,
    complianceReviewed,
    piiRiskLevel,
    lastReviewedBy,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
