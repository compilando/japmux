# PromptsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**promptControllerAddOrUpdateTranslation**](#promptcontrolleraddorupdatetranslation) | **PUT** /api/projects/{projectId}/prompts/{promptName}/versions/{versionId}/translations | Añadir o actualizar una traducción para una versión específica de prompt en el proyecto.|
|[**promptControllerCreate**](#promptcontrollercreate) | **POST** /api/projects/{projectId}/prompts | Crea un nuevo prompt lógico dentro de un proyecto|
|[**promptControllerCreateVersion**](#promptcontrollercreateversion) | **POST** /api/projects/{projectId}/prompts/{promptName}/versions | Crear una nueva versión para un prompt existente en el proyecto.|
|[**promptControllerFindAll**](#promptcontrollerfindall) | **GET** /api/projects/{projectId}/prompts | Obtiene todos los prompts lógicos de un proyecto|
|[**promptControllerFindOne**](#promptcontrollerfindone) | **GET** /api/projects/{projectId}/prompts/{promptName} | Obtiene un prompt lógico por su nombre dentro de un proyecto|
|[**promptControllerRemove**](#promptcontrollerremove) | **DELETE** /api/projects/{projectId}/prompts/{promptName} | Elimina un prompt lógico (y sus versiones asociadas por Cascade) dentro de un proyecto|
|[**promptControllerUpdate**](#promptcontrollerupdate) | **PATCH** /api/projects/{projectId}/prompts/{promptName} | Actualiza metadatos de un prompt lógico (descripción, tags) dentro de un proyecto|

# **promptControllerAddOrUpdateTranslation**
> promptControllerAddOrUpdateTranslation(createOrUpdatePromptTranslationDto)


### Example

```typescript
import {
    PromptsApi,
    Configuration,
    CreateOrUpdatePromptTranslationDto
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptsApi(configuration);

let versionId: string; //ID de la versión a traducir (CUID) (default to undefined)
let promptName: string; //Nombre del prompt padre (contextual) (default to undefined)
let projectId: string; //ID del proyecto (default to undefined)
let createOrUpdatePromptTranslationDto: CreateOrUpdatePromptTranslationDto; //

const { status, data } = await apiInstance.promptControllerAddOrUpdateTranslation(
    versionId,
    promptName,
    projectId,
    createOrUpdatePromptTranslationDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createOrUpdatePromptTranslationDto** | **CreateOrUpdatePromptTranslationDto**|  | |
| **versionId** | [**string**] | ID de la versión a traducir (CUID) | defaults to undefined|
| **promptName** | [**string**] | Nombre del prompt padre (contextual) | defaults to undefined|
| **projectId** | [**string**] | ID del proyecto | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Traducción creada o actualizada. |  -  |
|**400** | Datos inválidos. |  -  |
|**404** | Proyecto o Versión no encontrada. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **promptControllerCreate**
> CreatePromptDto promptControllerCreate(createPromptDto)


### Example

```typescript
import {
    PromptsApi,
    Configuration,
    CreatePromptDto
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptsApi(configuration);

let projectId: string; //ID del proyecto (default to undefined)
let createPromptDto: CreatePromptDto; //

const { status, data } = await apiInstance.promptControllerCreate(
    projectId,
    createPromptDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createPromptDto** | **CreatePromptDto**|  | |
| **projectId** | [**string**] | ID del proyecto | defaults to undefined|


### Return type

**CreatePromptDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Prompt creado. |  -  |
|**400** | Datos inválidos (e.g., falta promptText inicial). |  -  |
|**404** | Proyecto o Tag no encontrado. |  -  |
|**409** | Conflicto, ya existe un prompt con ese nombre en el proyecto. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **promptControllerCreateVersion**
> promptControllerCreateVersion(createPromptVersionDto)


### Example

```typescript
import {
    PromptsApi,
    Configuration,
    CreatePromptVersionDto
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptsApi(configuration);

let promptName: string; //Nombre del prompt padre dentro del proyecto (default to undefined)
let projectId: string; //ID del proyecto (default to undefined)
let createPromptVersionDto: CreatePromptVersionDto; //

const { status, data } = await apiInstance.promptControllerCreateVersion(
    promptName,
    projectId,
    createPromptVersionDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createPromptVersionDto** | **CreatePromptVersionDto**|  | |
| **promptName** | [**string**] | Nombre del prompt padre dentro del proyecto | defaults to undefined|
| **projectId** | [**string**] | ID del proyecto | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Nueva versión creada. |  -  |
|**400** | Datos inválidos. |  -  |
|**404** | Proyecto, Prompt padre, AssetVersion o Environment no encontrado. |  -  |
|**409** | Conflicto (e.g., versionTag ya existe para este prompt). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **promptControllerFindAll**
> Array<CreatePromptDto> promptControllerFindAll()


### Example

```typescript
import {
    PromptsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptsApi(configuration);

let projectId: string; //ID del proyecto (default to undefined)

const { status, data } = await apiInstance.promptControllerFindAll(
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] | ID del proyecto | defaults to undefined|


### Return type

**Array<CreatePromptDto>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Lista de prompts. |  -  |
|**404** | Proyecto no encontrado. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **promptControllerFindOne**
> CreatePromptDto promptControllerFindOne()


### Example

```typescript
import {
    PromptsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptsApi(configuration);

let promptName: string; //Nombre único del prompt dentro del proyecto (default to undefined)
let projectId: string; //ID del proyecto (default to undefined)

const { status, data } = await apiInstance.promptControllerFindOne(
    promptName,
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **promptName** | [**string**] | Nombre único del prompt dentro del proyecto | defaults to undefined|
| **projectId** | [**string**] | ID del proyecto | defaults to undefined|


### Return type

**CreatePromptDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Prompt encontrado. |  -  |
|**404** | Proyecto o Prompt no encontrado. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **promptControllerRemove**
> promptControllerRemove()


### Example

```typescript
import {
    PromptsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptsApi(configuration);

let promptName: string; //Nombre único del prompt a eliminar dentro del proyecto (default to undefined)
let projectId: string; //ID del proyecto (default to undefined)

const { status, data } = await apiInstance.promptControllerRemove(
    promptName,
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **promptName** | [**string**] | Nombre único del prompt a eliminar dentro del proyecto | defaults to undefined|
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
|**200** | Prompt eliminado. |  -  |
|**404** | Proyecto o Prompt no encontrado. |  -  |
|**409** | Conflicto al eliminar (revisar relaciones sin Cascade). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **promptControllerUpdate**
> CreatePromptDto promptControllerUpdate(updatePromptDto)


### Example

```typescript
import {
    PromptsApi,
    Configuration,
    UpdatePromptDto
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptsApi(configuration);

let promptName: string; //Nombre único del prompt a actualizar dentro del proyecto (default to undefined)
let projectId: string; //ID del proyecto (default to undefined)
let updatePromptDto: UpdatePromptDto; //

const { status, data } = await apiInstance.promptControllerUpdate(
    promptName,
    projectId,
    updatePromptDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updatePromptDto** | **UpdatePromptDto**|  | |
| **promptName** | [**string**] | Nombre único del prompt a actualizar dentro del proyecto | defaults to undefined|
| **projectId** | [**string**] | ID del proyecto | defaults to undefined|


### Return type

**CreatePromptDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Prompt actualizado. |  -  |
|**400** | Datos inválidos. |  -  |
|**404** | Proyecto, Prompt o Tag no encontrado. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

