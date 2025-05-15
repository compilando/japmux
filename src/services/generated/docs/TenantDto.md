# TenantDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | The unique identifier of the tenant. | [default to undefined]
**name** | **string** | The name of the tenant. | [default to undefined]
**marketplaceRequiresApproval** | **boolean** | Indicates if marketplace prompt versions require approval for this tenant. | [default to undefined]
**createdAt** | **string** | The date and time the tenant was created. | [default to undefined]
**updatedAt** | **string** | The date and time the tenant was last updated. | [default to undefined]

## Example

```typescript
import { TenantDto } from './api';

const instance: TenantDto = {
    id,
    name,
    marketplaceRequiresApproval,
    createdAt,
    updatedAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
