# CreateUserDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | User\&#39;s name | [optional] [default to undefined]
**email** | **string** | Unique user email | [default to undefined]
**password** | **string** | User\&#39;s password | [default to undefined]
**role** | **string** | Role of the user | [optional] [default to RoleEnum_User]
**tenantId** | **string** | Optional tenant ID to create the user in. Only used if the requesting user is a tenant_admin. Can be a UUID or \&quot;default-tenant\&quot; | [optional] [default to undefined]

## Example

```typescript
import { CreateUserDto } from './api';

const instance: CreateUserDto = {
    name,
    email,
    password,
    role,
    tenantId,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
