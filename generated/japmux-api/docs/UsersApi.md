# UsersApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**userControllerCreate**](#usercontrollercreate) | **POST** /api/users | Create new user|
|[**userControllerFindAll**](#usercontrollerfindall) | **GET** /api/users | Get all users|
|[**userControllerFindOne**](#usercontrollerfindone) | **GET** /api/users/{id} | Get user by ID|
|[**userControllerRemove**](#usercontrollerremove) | **DELETE** /api/users/{id} | Delete user|
|[**userControllerUpdate**](#usercontrollerupdate) | **PATCH** /api/users/{id} | Update user|

# **userControllerCreate**
> CreateUserDto userControllerCreate(createUserDto)

Creates a new user within the authenticated admin\'s tenant. Requires admin privileges.

### Example

```typescript
import {
    UsersApi,
    Configuration,
    CreateUserDto
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let createUserDto: CreateUserDto; //User data to create

const { status, data } = await apiInstance.userControllerCreate(
    createUserDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createUserDto** | **CreateUserDto**| User data to create | |


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
|**201** | User successfully created |  -  |
|**400** | Invalid input data - Check the request body format |  -  |
|**401** | Unauthorized - Invalid or expired token |  -  |
|**403** | Forbidden - Admin role required |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerFindAll**
> Array<CreateUserDto> userControllerFindAll()

Retrieves a list of all users in the system. Requires admin privileges.

### Example

```typescript
import {
    UsersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

const { status, data } = await apiInstance.userControllerFindAll();
```

### Parameters
This endpoint does not have any parameters.


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
|**403** | Forbidden - Admin role required |  -  |

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

