# TenantsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**tenantControllerCreate**](#tenantcontrollercreate) | **POST** /api/tenants | Create new tenant|
|[**tenantControllerFindAll**](#tenantcontrollerfindall) | **GET** /api/tenants | Get all tenants|
|[**tenantControllerFindOne**](#tenantcontrollerfindone) | **GET** /api/tenants/{tenantId} | Get tenant by ID|
|[**tenantControllerRemove**](#tenantcontrollerremove) | **DELETE** /api/tenants/{tenantId} | Delete tenant|
|[**tenantControllerUpdate**](#tenantcontrollerupdate) | **PATCH** /api/tenants/{tenantId} | Update tenant|

# **tenantControllerCreate**
> TenantDto tenantControllerCreate(createTenantDto)

Creates a new tenant in the system. This operation requires global admin privileges.

### Example

```typescript
import {
    TenantsApi,
    Configuration,
    CreateTenantDto
} from './api';

const configuration = new Configuration();
const apiInstance = new TenantsApi(configuration);

let createTenantDto: CreateTenantDto; //

const { status, data } = await apiInstance.tenantControllerCreate(
    createTenantDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createTenantDto** | **CreateTenantDto**|  | |


### Return type

**TenantDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Tenant successfully created |  -  |
|**400** | Invalid input data - Check the request body format |  -  |
|**401** | Unauthorized - Invalid or expired token |  -  |
|**403** | Forbidden - Global admin role required |  -  |
|**409** | Tenant name already exists - The provided name is already in use |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tenantControllerFindAll**
> Array<TenantDto> tenantControllerFindAll()

Retrieves a list of all tenants in the system. This operation requires global admin privileges.

### Example

```typescript
import {
    TenantsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TenantsApi(configuration);

const { status, data } = await apiInstance.tenantControllerFindAll();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<TenantDto>**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | List of tenants retrieved successfully |  -  |
|**401** | Unauthorized - Invalid or expired token |  -  |
|**403** | Forbidden - Global admin role required |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tenantControllerFindOne**
> TenantDto tenantControllerFindOne()

Retrieves a specific tenant by their unique ID. Accessible by global admins or tenant admins of the specified tenant.

### Example

```typescript
import {
    TenantsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TenantsApi(configuration);

let tenantId: string; //Unique tenant identifier (UUID) (default to undefined)

const { status, data } = await apiInstance.tenantControllerFindOne(
    tenantId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **tenantId** | [**string**] | Unique tenant identifier (UUID) | defaults to undefined|


### Return type

**TenantDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Tenant found successfully |  -  |
|**401** | Unauthorized - Invalid or expired token |  -  |
|**403** | Forbidden - Insufficient permissions to access this tenant |  -  |
|**404** | Tenant not found - The specified ID does not exist |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tenantControllerRemove**
> tenantControllerRemove()

Permanently deletes a tenant from the system. This is a destructive operation that requires global admin privileges.

### Example

```typescript
import {
    TenantsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TenantsApi(configuration);

let tenantId: string; //Unique tenant identifier to delete (UUID) (default to undefined)

const { status, data } = await apiInstance.tenantControllerRemove(
    tenantId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **tenantId** | [**string**] | Unique tenant identifier to delete (UUID) | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | Tenant successfully deleted |  -  |
|**401** | Unauthorized - Invalid or expired token |  -  |
|**403** | Forbidden - Global admin role required |  -  |
|**404** | Tenant not found - The specified ID does not exist |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tenantControllerUpdate**
> TenantDto tenantControllerUpdate(updateTenantDto)

Updates an existing tenant\'s information. Accessible by global admins or tenant admins of the specified tenant.

### Example

```typescript
import {
    TenantsApi,
    Configuration,
    UpdateTenantDto
} from './api';

const configuration = new Configuration();
const apiInstance = new TenantsApi(configuration);

let tenantId: string; //Unique tenant identifier to update (UUID) (default to undefined)
let updateTenantDto: UpdateTenantDto; //

const { status, data } = await apiInstance.tenantControllerUpdate(
    tenantId,
    updateTenantDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateTenantDto** | **UpdateTenantDto**|  | |
| **tenantId** | [**string**] | Unique tenant identifier to update (UUID) | defaults to undefined|


### Return type

**TenantDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Tenant updated successfully |  -  |
|**400** | Invalid input data - Check the request body format |  -  |
|**401** | Unauthorized - Invalid or expired token |  -  |
|**403** | Forbidden - Insufficient permissions to update this tenant |  -  |
|**404** | Tenant not found - The specified ID does not exist |  -  |
|**409** | Tenant name already exists - The provided name is already in use |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

