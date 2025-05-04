# RegionsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**regionControllerCreate**](#regioncontrollercreate) | **POST** /api/projects/{projectId}/regions | Crear una nueva región para un proyecto específico|
|[**regionControllerFindAll**](#regioncontrollerfindall) | **GET** /api/projects/{projectId}/regions | Obtener todas las regiones para un proyecto específico|
|[**regionControllerFindOne**](#regioncontrollerfindone) | **GET** /api/projects/{projectId}/regions/{languageCode} | Obtener una región específica dentro de un proyecto|
|[**regionControllerRemove**](#regioncontrollerremove) | **DELETE** /api/projects/{projectId}/regions/{languageCode} | Eliminar una región específica dentro de un proyecto|
|[**regionControllerUpdate**](#regioncontrollerupdate) | **PATCH** /api/projects/{projectId}/regions/{languageCode} | Actualizar una región específica dentro de un proyecto|

# **regionControllerCreate**
> CreateRegionDto regionControllerCreate(createRegionDto)


### Example

```typescript
import {
    RegionsApi,
    Configuration,
    CreateRegionDto
} from './api';

const configuration = new Configuration();
const apiInstance = new RegionsApi(configuration);

let projectId: string; //ID del proyecto (default to undefined)
let createRegionDto: CreateRegionDto; //

const { status, data } = await apiInstance.regionControllerCreate(
    projectId,
    createRegionDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createRegionDto** | **CreateRegionDto**|  | |
| **projectId** | [**string**] | ID del proyecto | defaults to undefined|


### Return type

**CreateRegionDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Región creada. |  -  |
|**400** | Datos inválidos. |  -  |
|**404** | Región padre no encontrada. |  -  |
|**409** | languageCode ya existe. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **regionControllerFindAll**
> Array<CreateRegionDto> regionControllerFindAll()


### Example

```typescript
import {
    RegionsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RegionsApi(configuration);

let projectId: string; //ID del proyecto (default to undefined)

const { status, data } = await apiInstance.regionControllerFindAll(
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] | ID del proyecto | defaults to undefined|


### Return type

**Array<CreateRegionDto>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Lista de regiones. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **regionControllerFindOne**
> CreateRegionDto regionControllerFindOne()


### Example

```typescript
import {
    RegionsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RegionsApi(configuration);

let languageCode: string; //Código de idioma (ID) de la región (default to undefined)
let projectId: string; //ID del proyecto (default to undefined)

const { status, data } = await apiInstance.regionControllerFindOne(
    languageCode,
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **languageCode** | [**string**] | Código de idioma (ID) de la región | defaults to undefined|
| **projectId** | [**string**] | ID del proyecto | defaults to undefined|


### Return type

**CreateRegionDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Región encontrada. |  -  |
|**404** | Proyecto o Región no encontrada. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **regionControllerRemove**
> regionControllerRemove()


### Example

```typescript
import {
    RegionsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RegionsApi(configuration);

let languageCode: string; //Código de idioma (ID) de la región a eliminar (default to undefined)
let projectId: string; //ID del proyecto (default to undefined)

const { status, data } = await apiInstance.regionControllerRemove(
    languageCode,
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **languageCode** | [**string**] | Código de idioma (ID) de la región a eliminar | defaults to undefined|
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
|**200** | Región eliminada. |  -  |
|**404** | Proyecto o Región no encontrada. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **regionControllerUpdate**
> CreateRegionDto regionControllerUpdate(updateRegionDto)


### Example

```typescript
import {
    RegionsApi,
    Configuration,
    UpdateRegionDto
} from './api';

const configuration = new Configuration();
const apiInstance = new RegionsApi(configuration);

let languageCode: string; //Código de idioma (ID) de la región a actualizar (default to undefined)
let projectId: string; //ID del proyecto (default to undefined)
let updateRegionDto: UpdateRegionDto; //

const { status, data } = await apiInstance.regionControllerUpdate(
    languageCode,
    projectId,
    updateRegionDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateRegionDto** | **UpdateRegionDto**|  | |
| **languageCode** | [**string**] | Código de idioma (ID) de la región a actualizar | defaults to undefined|
| **projectId** | [**string**] | ID del proyecto | defaults to undefined|


### Return type

**CreateRegionDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Región actualizada. |  -  |
|**400** | Datos inválidos (languageCode no se puede cambiar). |  -  |
|**404** | Proyecto o Región no encontrada. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

