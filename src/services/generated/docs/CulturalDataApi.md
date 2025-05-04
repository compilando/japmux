# CulturalDataApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**culturalDataControllerCreate**](#culturaldatacontrollercreate) | **POST** /api/projects/{projectId}/cultural-data | Crear nuevos datos culturales dentro de un proyecto|
|[**culturalDataControllerFindAll**](#culturaldatacontrollerfindall) | **GET** /api/projects/{projectId}/cultural-data | Obtener todos los datos culturales de un proyecto|
|[**culturalDataControllerFindOne**](#culturaldatacontrollerfindone) | **GET** /api/projects/{projectId}/cultural-data/{culturalDataId} | Obtener datos culturales por ID dentro de un proyecto|
|[**culturalDataControllerRemove**](#culturaldatacontrollerremove) | **DELETE** /api/projects/{projectId}/cultural-data/{culturalDataId} | Eliminar datos culturales por ID dentro de un proyecto|
|[**culturalDataControllerUpdate**](#culturaldatacontrollerupdate) | **PATCH** /api/projects/{projectId}/cultural-data/{culturalDataId} | Actualizar datos culturales por ID dentro de un proyecto|

# **culturalDataControllerCreate**
> CulturalDataResponse culturalDataControllerCreate(createCulturalDataDto)


### Example

```typescript
import {
    CulturalDataApi,
    Configuration,
    CreateCulturalDataDto
} from './api';

const configuration = new Configuration();
const apiInstance = new CulturalDataApi(configuration);

let projectId: string; //ID del proyecto (default to undefined)
let createCulturalDataDto: CreateCulturalDataDto; //

const { status, data } = await apiInstance.culturalDataControllerCreate(
    projectId,
    createCulturalDataDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createCulturalDataDto** | **CreateCulturalDataDto**|  | |
| **projectId** | [**string**] | ID del proyecto | defaults to undefined|


### Return type

**CulturalDataResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Datos culturales creados. |  -  |
|**400** | Datos inválidos. |  -  |
|**404** | Proyecto o Región referenciada no encontrada. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **culturalDataControllerFindAll**
> Array<CulturalDataResponse> culturalDataControllerFindAll()


### Example

```typescript
import {
    CulturalDataApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CulturalDataApi(configuration);

let projectId: string; //ID del proyecto (default to undefined)

const { status, data } = await apiInstance.culturalDataControllerFindAll(
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] | ID del proyecto | defaults to undefined|


### Return type

**Array<CulturalDataResponse>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Lista de datos culturales. |  -  |
|**404** | Proyecto no encontrado. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **culturalDataControllerFindOne**
> CulturalDataResponse culturalDataControllerFindOne()


### Example

```typescript
import {
    CulturalDataApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CulturalDataApi(configuration);

let culturalDataId: string; //ID de los datos culturales (default to undefined)
let projectId: string; //ID del proyecto (default to undefined)

const { status, data } = await apiInstance.culturalDataControllerFindOne(
    culturalDataId,
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **culturalDataId** | [**string**] | ID de los datos culturales | defaults to undefined|
| **projectId** | [**string**] | ID del proyecto | defaults to undefined|


### Return type

**CulturalDataResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Datos culturales encontrados. |  -  |
|**404** | Proyecto o Datos culturales no encontrados. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **culturalDataControllerRemove**
> culturalDataControllerRemove()


### Example

```typescript
import {
    CulturalDataApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CulturalDataApi(configuration);

let culturalDataId: string; //ID a eliminar (default to undefined)
let projectId: string; //ID del proyecto (default to undefined)

const { status, data } = await apiInstance.culturalDataControllerRemove(
    culturalDataId,
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **culturalDataId** | [**string**] | ID a eliminar | defaults to undefined|
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
|**200** | Datos culturales eliminados. |  -  |
|**404** | Proyecto o Datos culturales no encontrados. |  -  |
|**409** | Conflicto al eliminar (referenciado por otras entidades). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **culturalDataControllerUpdate**
> CulturalDataResponse culturalDataControllerUpdate(updateCulturalDataDto)


### Example

```typescript
import {
    CulturalDataApi,
    Configuration,
    UpdateCulturalDataDto
} from './api';

const configuration = new Configuration();
const apiInstance = new CulturalDataApi(configuration);

let culturalDataId: string; //ID a actualizar (default to undefined)
let projectId: string; //ID del proyecto (default to undefined)
let updateCulturalDataDto: UpdateCulturalDataDto; //

const { status, data } = await apiInstance.culturalDataControllerUpdate(
    culturalDataId,
    projectId,
    updateCulturalDataDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateCulturalDataDto** | **UpdateCulturalDataDto**|  | |
| **culturalDataId** | [**string**] | ID a actualizar | defaults to undefined|
| **projectId** | [**string**] | ID del proyecto | defaults to undefined|


### Return type

**CulturalDataResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Datos culturales actualizados. |  -  |
|**400** | Datos inválidos. |  -  |
|**404** | Proyecto o Datos culturales no encontrados. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

