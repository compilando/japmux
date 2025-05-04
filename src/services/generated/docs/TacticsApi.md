# TacticsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**tacticControllerCreate**](#tacticcontrollercreate) | **POST** /api/projects/{projectId}/tactics | Crea una nueva táctica conversacional dentro de un proyecto|
|[**tacticControllerFindAll**](#tacticcontrollerfindall) | **GET** /api/projects/{projectId}/tactics | Obtiene todas las tácticas conversacionales de un proyecto|
|[**tacticControllerFindOne**](#tacticcontrollerfindone) | **GET** /api/projects/{projectId}/tactics/{tacticName} | Obtiene una táctica por su nombre (ID) dentro de un proyecto|
|[**tacticControllerRemove**](#tacticcontrollerremove) | **DELETE** /api/projects/{projectId}/tactics/{tacticName} | Elimina una táctica dentro de un proyecto|
|[**tacticControllerUpdate**](#tacticcontrollerupdate) | **PATCH** /api/projects/{projectId}/tactics/{tacticName} | Actualiza una táctica existente dentro de un proyecto|

# **tacticControllerCreate**
> TacticResponse tacticControllerCreate(createTacticDto)


### Example

```typescript
import {
    TacticsApi,
    Configuration,
    CreateTacticDto
} from './api';

const configuration = new Configuration();
const apiInstance = new TacticsApi(configuration);

let projectId: string; //ID del proyecto (default to undefined)
let createTacticDto: CreateTacticDto; //

const { status, data } = await apiInstance.tacticControllerCreate(
    projectId,
    createTacticDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createTacticDto** | **CreateTacticDto**|  | |
| **projectId** | [**string**] | ID del proyecto | defaults to undefined|


### Return type

**TacticResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Táctica creada. |  -  |
|**400** | Datos inválidos. |  -  |
|**404** | Proyecto, Región o CulturalData no encontrada. |  -  |
|**409** | Conflicto, ya existe una táctica con ese nombre en el proyecto. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tacticControllerFindAll**
> Array<TacticResponse> tacticControllerFindAll()


### Example

```typescript
import {
    TacticsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TacticsApi(configuration);

let projectId: string; //ID del proyecto (default to undefined)

const { status, data } = await apiInstance.tacticControllerFindAll(
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] | ID del proyecto | defaults to undefined|


### Return type

**Array<TacticResponse>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Lista de tácticas. |  -  |
|**404** | Proyecto no encontrado. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tacticControllerFindOne**
> TacticResponse tacticControllerFindOne()


### Example

```typescript
import {
    TacticsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TacticsApi(configuration);

let tacticName: string; //Nombre único de la táctica (default to undefined)
let projectId: string; //ID del proyecto (default to undefined)

const { status, data } = await apiInstance.tacticControllerFindOne(
    tacticName,
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **tacticName** | [**string**] | Nombre único de la táctica | defaults to undefined|
| **projectId** | [**string**] | ID del proyecto | defaults to undefined|


### Return type

**TacticResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Táctica encontrada. |  -  |
|**404** | Proyecto o Táctica no encontrada. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tacticControllerRemove**
> tacticControllerRemove()


### Example

```typescript
import {
    TacticsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TacticsApi(configuration);

let tacticName: string; //Nombre único de la táctica a eliminar (default to undefined)
let projectId: string; //ID del proyecto (default to undefined)

const { status, data } = await apiInstance.tacticControllerRemove(
    tacticName,
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **tacticName** | [**string**] | Nombre único de la táctica a eliminar | defaults to undefined|
| **projectId** | [**string**] | ID del proyecto | defaults to undefined|


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
|**200** | Táctica eliminada. |  -  |
|**404** | Proyecto o Táctica no encontrada. |  -  |
|**409** | Conflicto al eliminar (referenciada por prompts). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tacticControllerUpdate**
> TacticResponse tacticControllerUpdate(updateTacticDto)


### Example

```typescript
import {
    TacticsApi,
    Configuration,
    UpdateTacticDto
} from './api';

const configuration = new Configuration();
const apiInstance = new TacticsApi(configuration);

let tacticName: string; //Nombre único de la táctica a actualizar (default to undefined)
let projectId: string; //ID del proyecto (default to undefined)
let updateTacticDto: UpdateTacticDto; //

const { status, data } = await apiInstance.tacticControllerUpdate(
    tacticName,
    projectId,
    updateTacticDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateTacticDto** | **UpdateTacticDto**|  | |
| **tacticName** | [**string**] | Nombre único de la táctica a actualizar | defaults to undefined|
| **projectId** | [**string**] | ID del proyecto | defaults to undefined|


### Return type

**TacticResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Táctica actualizada. |  -  |
|**400** | Datos inválidos. |  -  |
|**404** | Proyecto, Táctica, Región o CulturalData no encontrada. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

