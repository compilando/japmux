# UsersApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**userControllerCreate**](#usercontrollercreate) | **POST** /api/users | Create new user|
|[**userControllerFindAll**](#usercontrollerfindall) | **GET** /api/users | Get all users|
|[**userControllerFindOne**](#usercontrollerfindone) | **GET** /api/users/{id} | Get user by ID|
|[**userControllerRemove**](#usercontrollerremove) | **DELETE** /api/users/{id} | Delete user|
|[**userControllerUpdate**](#usercontrollerupdate) | **PATCH** /api/users/{id} | Update user|
|[**userControllerUpdateCredentials**](#usercontrollerupdatecredentials) | **PATCH** /api/users/{id}/credentials | Update user credentials|

# **userControllerCreate**
> CreateUserDto userControllerCreate(createUserDto)

Creates a new user in the system. For tenant_admins, can optionally specify a tenantId to create the user in that tenant.

### Example

```typescript
import {
    UsersApi,
    Configuration,
    CreateUserDto
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let createUserDto: CreateUserDto; //

const { status, data } = await apiInstance.userControllerCreate(
    createUserDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createUserDto** | **CreateUserDto**|  | |


### Return type

**CreateUserDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | User created successfully |  -  |
|**400** | Invalid input data - Check the request body format |  -  |
|**401** | Unauthorized - Invalid or expired token |  -  |
|**403** | Forbidden - Admin or tenant admin role required |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerFindAll**
> Array<CreateUserDto> userControllerFindAll()

Retrieves a list of users. For tenant_admins, can optionally specify a tenantId to list users from that tenant.

### Example

```typescript
import {
    UsersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let tenantId: string; //Optional tenant ID to filter users. Only for tenant_admins. Can be a UUID or \"default-tenant\" (optional) (default to undefined)

const { status, data } = await apiInstance.userControllerFindAll(
    tenantId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **tenantId** | [**string**] | Optional tenant ID to filter users. Only for tenant_admins. Can be a UUID or \&quot;default-tenant\&quot; | (optional) defaults to undefined|


### Return type

**Array<CreateUserDto>**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | List of users retrieved successfully |  -  |
|**401** | Unauthorized - Invalid or expired token |  -  |
|**403** | Forbidden - Admin role required or invalid tenant access |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerFindOne**
> CreateUserDto userControllerFindOne()

Retrieves a specific user by their unique ID. Requires admin privileges.

### Example

```typescript
import {
    UsersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let id: string; //Unique user identifier (CUID) (default to undefined)

const { status, data } = await apiInstance.userControllerFindOne(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Unique user identifier (CUID) | defaults to undefined|


### Return type

**CreateUserDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | User found successfully |  -  |
|**401** | Unauthorized - Invalid or expired token |  -  |
|**403** | Forbidden - Admin role required |  -  |
|**404** | User not found - The specified ID does not exist |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerRemove**
> CreateUserDto userControllerRemove()

Permanently deletes a user from the system. Requires admin privileges.

### Example

```typescript
import {
    UsersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let id: string; //Unique user identifier to delete (CUID) (default to undefined)

const { status, data } = await apiInstance.userControllerRemove(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Unique user identifier to delete (CUID) | defaults to undefined|


### Return type

**CreateUserDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | User deleted successfully |  -  |
|**401** | Unauthorized - Invalid or expired token |  -  |
|**403** | Forbidden - Admin role required |  -  |
|**404** | User not found - The specified ID does not exist |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerUpdate**
> CreateUserDto userControllerUpdate(body)

Updates an existing user\'s information. Requires admin privileges.

### Example

```typescript
import {
    UsersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let id: string; //Unique user identifier to update (CUID) (default to undefined)
let body: object; //User data to update

const { status, data } = await apiInstance.userControllerUpdate(
    id,
    body
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **body** | **object**| User data to update | |
| **id** | [**string**] | Unique user identifier to update (CUID) | defaults to undefined|


### Return type

**CreateUserDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | User updated successfully |  -  |
|**400** | Invalid input data - Check the request body format |  -  |
|**401** | Unauthorized - Invalid or expired token |  -  |
|**403** | Forbidden - Admin role required |  -  |
|**404** | User not found - The specified ID does not exist |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerUpdateCredentials**
> userControllerUpdateCredentials(updateUserCredentialsDto)


### Example

```typescript
import {
    UsersApi,
    Configuration,
    UpdateUserCredentialsDto
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let id: string; //User ID (default to undefined)
let updateUserCredentialsDto: UpdateUserCredentialsDto; //

const { status, data } = await apiInstance.userControllerUpdateCredentials(
    id,
    updateUserCredentialsDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateUserCredentialsDto** | **UpdateUserCredentialsDto**|  | |
| **id** | [**string**] | User ID | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | User credentials updated successfully |  -  |
|**401** | Unauthorized |  -  |
|**403** | Forbidden |  -  |
|**404** | User not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

