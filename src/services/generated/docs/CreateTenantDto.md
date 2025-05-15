# CreateTenantDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | The name of the tenant. | [default to undefined]
**marketplaceRequiresApproval** | **boolean** | Indicates if marketplace prompt versions require approval for this tenant. Defaults to true. | [optional] [default to undefined]
**initialAdminUser** | [**CreateTenantAdminUserDto**](CreateTenantAdminUserDto.md) | Details for creating an initial admin user for this tenant. | [default to undefined]

## Example

```typescript
import { CreateTenantDto } from './api';

const instance: CreateTenantDto = {
    name,
    marketplaceRequiresApproval,
    initialAdminUser,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
