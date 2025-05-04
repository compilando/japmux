# EnvironmentsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**environmentControllerCreate**](#environmentcontrollercreate) | **POST** /api/projects/{projectId}/environments | Crea un nuevo entorno para un proyecto|
|[**environmentControllerFindAll**](#environmentcontrollerfindall) | **GET** /api/projects/{projectId}/environments | Obtiene todos los entornos de un proyecto|
|[**environmentControllerFindByName**](#environmentcontrollerfindbyname) | **GET** /api/projects/{projectId}/environments/by-name/{name} | Obtiene un entorno por su nombre dentro de un proyecto|
|[**environmentControllerFindOne**](#environmentcontrollerfindone) | **GET** /api/projects/{projectId}/environments/{environmentId} | Obtiene un entorno por su ID dentro de un proyecto|
|[**environmentControllerRemove**](#environmentcontrollerremove) | **DELETE** /api/projects/{projectId}/environments/{environmentId} | Elimina un entorno de un proyecto|
|[**environmentControllerUpdate**](#environmentcontrollerupdate) | **PATCH** /api/projects/{projectId}/environments/{environmentId} | Actualiza un entorno existente en un proyecto|

# **environmentControllerCreate**
> CreateEnvironmentDto environmentControllerCreate(createEnvironmentDto)


### Example

```typescript
import {
    EnvironmentsApi,
    Configuration,
    CreateEnvironmentDto
} from './api';

const configuration = new Configuration();
const apiInstance = new EnvironmentsApi(configuration);

let projectId: string; //ID del proyecto (default to undefined)
let createEnvironmentDto: CreateEnvironmentDto; //

const { status, data } = await apiInstance.environmentControllerCreate(
    projectId,
    createEnvironmentDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createEnvironmentDto** | **CreateEnvironmentDto**|  | |
| **projectId** | [**string**] | ID del proyecto | defaults to undefined|


### Return type

**CreateEnvironmentDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Entorno creado. |  -  |
|**400** | Datos inválidos. |  -  |
|**404** | Proyecto no encontrado. |  -  |
|**409** | Conflicto, ya existe un entorno con ese nombre en el proyecto. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **environmentControllerFindAll**
> Array<CreateEnvironmentDto> environmentControllerFindAll()


### Example

```typescript
import {
    EnvironmentsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EnvironmentsApi(configuration);

let projectId: string; //ID del proyecto (default to undefined)

const { status, data } = await apiInstance.environmentControllerFindAll(
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] | ID del proyecto | defaults to undefined|


### Return type

**Array<CreateEnvironmentDto>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Lista de entornos. |  -  |
|**404** | Proyecto no encontrado. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **environmentControllerFindByName**
> CreateEnvironmentDto environmentControllerFindByName()


### Example

```typescript
import {
    EnvironmentsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EnvironmentsApi(configuration);

let name: string; //Nombre único del entorno en el proyecto (default to undefined)
let projectId: string; //ID del proyecto (default to undefined)

const { status, data } = await apiInstance.environmentControllerFindByName(
    name,
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **name** | [**string**] | Nombre único del entorno en el proyecto | defaults to undefined|
| **projectId** | [**string**] | ID del proyecto | defaults to undefined|


### Return type

**CreateEnvironmentDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Entorno encontrado. |  -  |
|**404** | Proyecto o Entorno no encontrado. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **environmentControllerFindOne**
> CreateEnvironmentDto environmentControllerFindOne()


### Example

```typescript
import {
    EnvironmentsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EnvironmentsApi(configuration);

let environmentId: string; //ID único del entorno (CUID) (default to undefined)
let projectId: string; //ID del proyecto (default to undefined)

const { status, data } = await apiInstance.environmentControllerFindOne(
    environmentId,
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **environmentId** | [**string**] | ID único del entorno (CUID) | defaults to undefined|
| **projectId** | [**string**] | ID del proyecto | defaults to undefined|


### Return type

**CreateEnvironmentDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Entorno encontrado. |  -  |
|**404** | Proyecto o Entorno no encontrado. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **environmentControllerRemove**
> CreateEnvironmentDto environmentControllerRemove()


### Example

```typescript
import {
    EnvironmentsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EnvironmentsApi(configuration);

let environmentId: string; //ID único del entorno a eliminar (CUID) (default to undefined)
let projectId: string; //ID del proyecto (default to undefined)

const { status, data } = await apiInstance.environmentControllerRemove(
    environmentId,
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **environmentId** | [**string**] | ID único del entorno a eliminar (CUID) | defaults to undefined|
| **projectId** | [**string**] | ID del proyecto | defaults to undefined|


### Return type

**CreateEnvironmentDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Entorno eliminado. |  -  |
|**404** | Proyecto o Entorno no encontrado. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **environmentControllerUpdate**
> CreateEnvironmentDto environmentControllerUpdate(updateEnvironmentDto)


### Example

```typescript
import {
    EnvironmentsApi,
    Configuration,
    UpdateEnvironmentDto
} from './api';

const configuration = new Configuration();
const apiInstance = new EnvironmentsApi(configuration);

let environmentId: string; //ID único del entorno a actualizar (CUID) (default to undefined)
let projectId: string; //ID del proyecto (default to undefined)
let updateEnvironmentDto: UpdateEnvironmentDto; //

const { status, data } = await apiInstance.environmentControllerUpdate(
    environmentId,
    projectId,
    updateEnvironmentDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateEnvironmentDto** | **UpdateEnvironmentDto**|  | |
| **environmentId** | [**string**] | ID único del entorno a actualizar (CUID) | defaults to undefined|
| **projectId** | [**string**] | ID del proyecto | defaults to undefined|


### Return type

**CreateEnvironmentDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Entorno actualizado. |  -  |
|**400** | Datos inválidos. |  -  |
|**404** | Proyecto o Entorno no encontrado. |  -  |
|**409** | Conflicto, ya existe un entorno con el nuevo nombre en el proyecto. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

