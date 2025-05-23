# AutenticacinYRolesApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**appControllerAdminCheck**](#appcontrolleradmincheck) | **GET** /api/admin-check | Verificar acceso de administrador|
|[**appControllerAnyAuthenticatedCheck**](#appcontrolleranyauthenticatedcheck) | **GET** /api/any-authenticated-check | Verificar autenticación|
|[**appControllerTenantAdminCheck**](#appcontrollertenantadmincheck) | **GET** /api/tenant-admin-check | Verificar acceso de administrador de tenant|
|[**appControllerUserCheck**](#appcontrollerusercheck) | **GET** /api/user-check | Verificar acceso de usuario|

# **appControllerAdminCheck**
> appControllerAdminCheck()

Endpoint para verificar si el usuario tiene rol de administrador

### Example

```typescript
import {
    AutenticacinYRolesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AutenticacinYRolesApi(configuration);

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
|**200** | Acceso concedido como administrador |  -  |
|**401** | No autorizado |  -  |
|**403** | Acceso denegado - Se requiere rol de administrador |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **appControllerAnyAuthenticatedCheck**
> appControllerAnyAuthenticatedCheck()

Endpoint para verificar si el usuario está autenticado (sin requerir rol específico)

### Example

```typescript
import {
    AutenticacinYRolesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AutenticacinYRolesApi(configuration);

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
|**200** | Acceso concedido - Usuario autenticado |  -  |
|**401** | No autorizado |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **appControllerTenantAdminCheck**
> appControllerTenantAdminCheck()

Endpoint para verificar si el usuario tiene rol de administrador de tenant

### Example

```typescript
import {
    AutenticacinYRolesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AutenticacinYRolesApi(configuration);

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
|**200** | Acceso concedido como administrador de tenant |  -  |
|**401** | No autorizado |  -  |
|**403** | Acceso denegado - Se requiere rol de administrador de tenant |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **appControllerUserCheck**
> appControllerUserCheck()

Endpoint para verificar si el usuario tiene rol de usuario básico

### Example

```typescript
import {
    AutenticacinYRolesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AutenticacinYRolesApi(configuration);

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
|**200** | Acceso concedido como usuario |  -  |
|**401** | No autorizado |  -  |
|**403** | Acceso denegado - Se requiere rol de usuario |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

