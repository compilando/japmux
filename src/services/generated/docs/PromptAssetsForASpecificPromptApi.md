# PromptAssetsForASpecificPromptApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**promptAssetControllerCreate**](#promptassetcontrollercreate) | **POST** /api/projects/{projectId}/prompts/{promptId}/assets | Crea un nuevo prompt asset (y su primera versión) para un prompt específico|
|[**promptAssetControllerFindAll**](#promptassetcontrollerfindall) | **GET** /api/projects/{projectId}/prompts/{promptId}/assets | Obtiene todos los prompt assets de un prompt específico|
|[**promptAssetControllerFindOne**](#promptassetcontrollerfindone) | **GET** /api/projects/{projectId}/prompts/{promptId}/assets/{assetKey} | Obtiene un prompt asset por su key dentro de un prompt específico|
|[**promptAssetControllerRemove**](#promptassetcontrollerremove) | **DELETE** /api/projects/{projectId}/prompts/{promptId}/assets/{assetKey} | Elimina un prompt asset (y sus versiones/traducciones por Cascade) dentro de un prompt|
|[**promptAssetControllerUpdate**](#promptassetcontrollerupdate) | **PATCH** /api/projects/{projectId}/prompts/{promptId}/assets/{assetKey} | Actualiza metadatos de un prompt asset (nombre, descripción, etc.) dentro de un prompt|

# **promptAssetControllerCreate**
> promptAssetControllerCreate(createPromptAssetDto)


### Example

```typescript
import {
    PromptAssetsForASpecificPromptApi,
    Configuration,
    CreatePromptAssetDto
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptAssetsForASpecificPromptApi(configuration);

let promptId: string; //ID (slug) del prompt padre (default to undefined)
let projectId: string; //ID del proyecto al que pertenece el prompt (default to undefined)
let createPromptAssetDto: CreatePromptAssetDto; //

const { status, data } = await apiInstance.promptAssetControllerCreate(
    promptId,
    projectId,
    createPromptAssetDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createPromptAssetDto** | **CreatePromptAssetDto**|  | |
| **promptId** | [**string**] | ID (slug) del prompt padre | defaults to undefined|
| **projectId** | [**string**] | ID del proyecto al que pertenece el prompt | defaults to undefined|


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
|**400** | Datos inválidos. |  -  |
|**404** | Proyecto o Prompt no encontrado. |  -  |
|**409** | Conflicto, ya existe un asset con esa key en el prompt. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **promptAssetControllerFindAll**
> promptAssetControllerFindAll()


### Example

```typescript
import {
    PromptAssetsForASpecificPromptApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptAssetsForASpecificPromptApi(configuration);

let promptId: string; //ID (slug) del prompt padre (default to undefined)
let projectId: string; //ID del proyecto al que pertenece el prompt (default to undefined)

const { status, data } = await apiInstance.promptAssetControllerFindAll(
    promptId,
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **promptId** | [**string**] | ID (slug) del prompt padre | defaults to undefined|
| **projectId** | [**string**] | ID del proyecto al que pertenece el prompt | defaults to undefined|


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
|**404** | Proyecto o Prompt no encontrado. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **promptAssetControllerFindOne**
> promptAssetControllerFindOne()


### Example

```typescript
import {
    PromptAssetsForASpecificPromptApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptAssetsForASpecificPromptApi(configuration);

let promptId: string; //ID (slug) del prompt padre (default to undefined)
let projectId: string; //ID del proyecto (default to undefined)
let assetKey: string; //Key única del asset dentro del prompt (default to undefined)

const { status, data } = await apiInstance.promptAssetControllerFindOne(
    promptId,
    projectId,
    assetKey
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **promptId** | [**string**] | ID (slug) del prompt padre | defaults to undefined|
| **projectId** | [**string**] | ID del proyecto | defaults to undefined|
| **assetKey** | [**string**] | Key única del asset dentro del prompt | defaults to undefined|


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
    PromptAssetsForASpecificPromptApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptAssetsForASpecificPromptApi(configuration);

let promptId: string; //ID (slug) del prompt padre (default to undefined)
let projectId: string; //ID del proyecto (default to undefined)
let assetKey: string; //Key única del asset a eliminar (default to undefined)

const { status, data } = await apiInstance.promptAssetControllerRemove(
    promptId,
    projectId,
    assetKey
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **promptId** | [**string**] | ID (slug) del prompt padre | defaults to undefined|
| **projectId** | [**string**] | ID del proyecto | defaults to undefined|
| **assetKey** | [**string**] | Key única del asset a eliminar | defaults to undefined|


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
    PromptAssetsForASpecificPromptApi,
    Configuration,
    UpdatePromptAssetDto
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptAssetsForASpecificPromptApi(configuration);

let promptId: string; //ID (slug) del prompt padre (default to undefined)
let projectId: string; //ID del proyecto (default to undefined)
let assetKey: string; //Key única del asset a actualizar (default to undefined)
let updatePromptAssetDto: UpdatePromptAssetDto; //

const { status, data } = await apiInstance.promptAssetControllerUpdate(
    promptId,
    projectId,
    assetKey,
    updatePromptAssetDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updatePromptAssetDto** | **UpdatePromptAssetDto**|  | |
| **promptId** | [**string**] | ID (slug) del prompt padre | defaults to undefined|
| **projectId** | [**string**] | ID del proyecto | defaults to undefined|
| **assetKey** | [**string**] | Key única del asset a actualizar | defaults to undefined|


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

