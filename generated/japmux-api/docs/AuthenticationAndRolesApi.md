# AuthenticationAndRolesApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**appControllerAdminCheck**](#appcontrolleradmincheck) | **GET** /api/admin-check | Check admin access|
|[**appControllerAnyAuthenticatedCheck**](#appcontrolleranyauthenticatedcheck) | **GET** /api/any-authenticated-check | Check authentication|
|[**appControllerTenantAdminCheck**](#appcontrollertenantadmincheck) | **GET** /api/tenant-admin-check | Check tenant admin access|
|[**appControllerUserCheck**](#appcontrollerusercheck) | **GET** /api/user-check | Check user access|

# **appControllerAdminCheck**
> appControllerAdminCheck()

Endpoint to verify if the user has admin role

### Example

```typescript
import {
    AuthenticationAndRolesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthenticationAndRolesApi(configuration);

const { status, data } = await apiInstance.appControllerAdminCheck();
```

### Parameters
This endpoint does not have any parameters.


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
|**200** | Admin access granted |  -  |
|**401** | Unauthorized |  -  |
|**403** | Access denied - Admin role required |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **appControllerAnyAuthenticatedCheck**
> appControllerAnyAuthenticatedCheck()

Endpoint to verify if the user is authenticated (without requiring specific role)

### Example

```typescript
import {
    AuthenticationAndRolesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthenticationAndRolesApi(configuration);

const { status, data } = await apiInstance.appControllerAnyAuthenticatedCheck();
```

### Parameters
This endpoint does not have any parameters.


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
|**200** | Access granted - User authenticated |  -  |
|**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **appControllerTenantAdminCheck**
> appControllerTenantAdminCheck()

Endpoint to verify if the user has tenant admin role

### Example

```typescript
import {
    AuthenticationAndRolesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthenticationAndRolesApi(configuration);

const { status, data } = await apiInstance.appControllerTenantAdminCheck();
```

### Parameters
This endpoint does not have any parameters.


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
|**200** | Tenant admin access granted |  -  |
|**401** | Unauthorized |  -  |
|**403** | Access denied - Tenant admin role required |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **appControllerUserCheck**
> appControllerUserCheck()

Endpoint to verify if the user has basic user role

### Example

```typescript
import {
    AuthenticationAndRolesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthenticationAndRolesApi(configuration);

const { status, data } = await apiInstance.appControllerUserCheck();
```

### Parameters
This endpoint does not have any parameters.


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
|**200** | User access granted |  -  |
|**401** | Unauthorized |  -  |
|**403** | Access denied - User role required |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

