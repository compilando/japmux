# AppApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**appControllerAdminCheck**](#appcontrolleradmincheck) | **GET** /api/admin-check | |
|[**appControllerAnyAuthenticatedCheck**](#appcontrolleranyauthenticatedcheck) | **GET** /api/any-authenticated-check | |
|[**appControllerTenantAdminCheck**](#appcontrollertenantadmincheck) | **GET** /api/tenant-admin-check | |
|[**appControllerUserCheck**](#appcontrollerusercheck) | **GET** /api/user-check | |

# **appControllerAdminCheck**
> appControllerAdminCheck()


### Example

```typescript
import {
    AppApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AppApi(configuration);

const { status, data } = await apiInstance.appControllerAdminCheck();
```

### Parameters
This endpoint does not have any parameters.


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **appControllerAnyAuthenticatedCheck**
> appControllerAnyAuthenticatedCheck()


### Example

```typescript
import {
    AppApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AppApi(configuration);

const { status, data } = await apiInstance.appControllerAnyAuthenticatedCheck();
```

### Parameters
This endpoint does not have any parameters.


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **appControllerTenantAdminCheck**
> appControllerTenantAdminCheck()


### Example

```typescript
import {
    AppApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AppApi(configuration);

const { status, data } = await apiInstance.appControllerTenantAdminCheck();
```

### Parameters
This endpoint does not have any parameters.


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **appControllerUserCheck**
> appControllerUserCheck()


### Example

```typescript
import {
    AppApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AppApi(configuration);

const { status, data } = await apiInstance.appControllerUserCheck();
```

### Parameters
This endpoint does not have any parameters.


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

