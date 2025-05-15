# TenantsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**tenantControllerCreate**](#tenantcontrollercreate) | **POST** /api/tenants | Create a new tenant|
|[**tenantControllerFindAll**](#tenantcontrollerfindall) | **GET** /api/tenants | Get all tenants|
|[**tenantControllerFindOne**](#tenantcontrollerfindone) | **GET** /api/tenants/{tenantId} | Get a specific tenant by ID|
|[**tenantControllerRemove**](#tenantcontrollerremove) | **DELETE** /api/tenants/{tenantId} | Delete a tenant by ID (Caution: Destructive operation)|
|[**tenantControllerUpdate**](#tenantcontrollerupdate) | **PATCH** /api/tenants/{tenantId} | Update a tenant by ID|

# **tenantControllerCreate**
> TenantDto tenantControllerCreate(createTenantDto)


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
|**201** | Tenant created successfully. |  -  |
|**400** | Invalid input. |  -  |
|**401** | Unauthorized. |  -  |
|**403** | Forbidden resource. |  -  |
|**409** | Tenant name already exists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tenantControllerFindAll**
> Array<TenantDto> tenantControllerFindAll()


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
|**200** | Array of tenants. |  -  |
|**401** | Unauthorized. |  -  |
|**403** | Forbidden resource. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tenantControllerFindOne**
> TenantDto tenantControllerFindOne()


### Example

```typescript
import {
    TenantsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TenantsApi(configuration);

let tenantId: string; //The ID of the tenant (default to undefined)

const { status, data } = await apiInstance.tenantControllerFindOne(
    tenantId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **tenantId** | [**string**] | The ID of the tenant | defaults to undefined|


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
|**200** | Tenant object. |  -  |
|**401** | Unauthorized. |  -  |
|**403** | Forbidden resource. |  -  |
|**404** | Tenant not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tenantControllerRemove**
> tenantControllerRemove()


### Example

```typescript
import {
    TenantsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TenantsApi(configuration);

let tenantId: string; //The ID of the tenant (default to undefined)

const { status, data } = await apiInstance.tenantControllerRemove(
    tenantId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **tenantId** | [**string**] | The ID of the tenant | defaults to undefined|


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
|**204** | Tenant deleted successfully. |  -  |
|**401** | Unauthorized. |  -  |
|**403** | Forbidden resource. |  -  |
|**404** | Tenant not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tenantControllerUpdate**
> TenantDto tenantControllerUpdate(updateTenantDto)


### Example

```typescript
import {
    TenantsApi,
    Configuration,
    UpdateTenantDto
} from './api';

const configuration = new Configuration();
const apiInstance = new TenantsApi(configuration);

let tenantId: string; //The ID of the tenant (default to undefined)
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
| **tenantId** | [**string**] | The ID of the tenant | defaults to undefined|


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
|**200** | Tenant updated successfully. |  -  |
|**400** | Invalid input. |  -  |
|**401** | Unauthorized. |  -  |
|**403** | Forbidden resource. |  -  |
|**404** | Tenant not found. |  -  |
|**409** | Tenant name already exists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

