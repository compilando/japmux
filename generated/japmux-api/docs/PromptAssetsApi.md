# PromptAssetsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**promptAssetControllerCreate**](#promptassetcontrollercreate) | **POST** /api/projects/{projectId}/prompt-assets | Crea un nuevo prompt asset (y su primera versión) dentro de un proyecto|
|[**promptAssetControllerFindAll**](#promptassetcontrollerfindall) | **GET** /api/projects/{projectId}/prompt-assets | Obtiene todos los prompt assets de un proyecto|
|[**promptAssetControllerFindOne**](#promptassetcontrollerfindone) | **GET** /api/projects/{projectId}/prompt-assets/{assetKey} | Obtiene un prompt asset por su key dentro de un proyecto|
|[**promptAssetControllerRemove**](#promptassetcontrollerremove) | **DELETE** /api/projects/{projectId}/prompt-assets/{assetKey} | Elimina un prompt asset (y sus versiones/traducciones por Cascade) dentro de un proyecto|
|[**promptAssetControllerUpdate**](#promptassetcontrollerupdate) | **PATCH** /api/projects/{projectId}/prompt-assets/{assetKey} | Actualiza metadatos de un prompt asset (nombre, descripción, etc.) dentro de un proyecto|

# **promptAssetControllerCreate**
> promptAssetControllerCreate(createPromptAssetDto)


### Example

```typescript
import {
    PromptAssetsApi,
    Configuration,
    CreatePromptAssetDto
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptAssetsApi(configuration);

let projectId: string; //ID del proyecto (default to undefined)
let createPromptAssetDto: CreatePromptAssetDto; //

const { status, data } = await apiInstance.promptAssetControllerCreate(
    projectId,
    createPromptAssetDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createPromptAssetDto** | **CreatePromptAssetDto**|  | |
| **projectId** | [**string**] | ID del proyecto | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Asset creado con su versión inicial. |  -  |
|**400** | Datos inválidos (e.g., falta initialValue). |  -  |
|**404** | Proyecto no encontrado. |  -  |
|**409** | Conflicto, ya existe un asset con esa key en el proyecto. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **promptAssetControllerFindAll**
> promptAssetControllerFindAll()


### Example

```typescript
import {
    PromptAssetsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptAssetsApi(configuration);

let projectId: string; //ID del proyecto (default to undefined)

const { status, data } = await apiInstance.promptAssetControllerFindAll(
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] | ID del proyecto | defaults to undefined|


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
|**200** | Lista de assets. |  -  |
|**404** | Proyecto no encontrado. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **promptAssetControllerFindOne**
> promptAssetControllerFindOne()


### Example

```typescript
import {
    PromptAssetsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptAssetsApi(configuration);

let assetKey: string; //Key única del asset dentro del proyecto (default to undefined)
let projectId: string; //ID del proyecto (default to undefined)

const { status, data } = await apiInstance.promptAssetControllerFindOne(
    assetKey,
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **assetKey** | [**string**] | Key única del asset dentro del proyecto | defaults to undefined|
| **projectId** | [**string**] | ID del proyecto | defaults to undefined|


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
|**200** | Asset encontrado con detalles. |  -  |
|**404** | Proyecto o Asset no encontrado. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **promptAssetControllerRemove**
> promptAssetControllerRemove()


### Example

```typescript
import {
    PromptAssetsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptAssetsApi(configuration);

let assetKey: string; //Key única del asset a eliminar (default to undefined)
let projectId: string; //ID del proyecto (default to undefined)

const { status, data } = await apiInstance.promptAssetControllerRemove(
    assetKey,
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **assetKey** | [**string**] | Key única del asset a eliminar | defaults to undefined|
| **projectId** | [**string**] | ID del proyecto | defaults to undefined|


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
|**200** | Asset eliminado. |  -  |
|**404** | Proyecto o Asset no encontrado. |  -  |
|**409** | Conflicto al eliminar (revisar relaciones sin Cascade). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **promptAssetControllerUpdate**
> promptAssetControllerUpdate(updatePromptAssetDto)


### Example

```typescript
import {
    PromptAssetsApi,
    Configuration,
    UpdatePromptAssetDto
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptAssetsApi(configuration);

let assetKey: string; //Key única del asset a actualizar (default to undefined)
let projectId: string; //ID del proyecto (default to undefined)
let updatePromptAssetDto: UpdatePromptAssetDto; //

const { status, data } = await apiInstance.promptAssetControllerUpdate(
    assetKey,
    projectId,
    updatePromptAssetDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updatePromptAssetDto** | **UpdatePromptAssetDto**|  | |
| **assetKey** | [**string**] | Key única del asset a actualizar | defaults to undefined|
| **projectId** | [**string**] | ID del proyecto | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Asset actualizado. |  -  |
|**400** | Datos inválidos. |  -  |
|**404** | Proyecto o Asset no encontrado. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

