# TagsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**tagControllerCreate**](#tagcontrollercreate) | **POST** /api/projects/{projectId}/tags | Crea una nueva etiqueta para un proyecto|
|[**tagControllerFindAll**](#tagcontrollerfindall) | **GET** /api/projects/{projectId}/tags | Get all tags from a project|
|[**tagControllerFindByName**](#tagcontrollerfindbyname) | **GET** /api/projects/{projectId}/tags/by-name/{name} | Get a tag by name within a project|
|[**tagControllerFindOne**](#tagcontrollerfindone) | **GET** /api/projects/{projectId}/tags/{tagId} | Get a tag by ID within a project|
|[**tagControllerRemove**](#tagcontrollerremove) | **DELETE** /api/projects/{projectId}/tags/{tagId} | Elimina una etiqueta de un proyecto|
|[**tagControllerUpdate**](#tagcontrollerupdate) | **PATCH** /api/projects/{projectId}/tags/{tagId} | Actualiza una etiqueta existente en un proyecto|

# **tagControllerCreate**
> TagDto tagControllerCreate(createTagDto)


### Example

```typescript
import {
    TagsApi,
    Configuration,
    CreateTagDto
} from './api';

const configuration = new Configuration();
const apiInstance = new TagsApi(configuration);

let projectId: string; //ID del proyecto (default to undefined)
let createTagDto: CreateTagDto; //

const { status, data } = await apiInstance.tagControllerCreate(
    projectId,
    createTagDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createTagDto** | **CreateTagDto**|  | |
| **projectId** | [**string**] | ID del proyecto | defaults to undefined|


### Return type

**TagDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Etiqueta creada. |  -  |
|**400** | Datos inválidos. |  -  |
|**404** | Proyecto no encontrado. |  -  |
|**409** | Conflicto, ya existe una etiqueta con ese nombre en el proyecto. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tagControllerFindAll**
> Array<TagDto> tagControllerFindAll()


### Example

```typescript
import {
    TagsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TagsApi(configuration);

let projectId: string; //Project ID (default to undefined)

const { status, data } = await apiInstance.tagControllerFindAll(
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] | Project ID | defaults to undefined|


### Return type

**Array<TagDto>**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | List of tags. |  -  |
|**404** | Project not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tagControllerFindByName**
> TagDto tagControllerFindByName()


### Example

```typescript
import {
    TagsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TagsApi(configuration);

let name: string; //Unique tag name in the project (default to undefined)
let projectId: string; //Project ID (default to undefined)

const { status, data } = await apiInstance.tagControllerFindByName(
    name,
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **name** | [**string**] | Unique tag name in the project | defaults to undefined|
| **projectId** | [**string**] | Project ID | defaults to undefined|


### Return type

**TagDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Tag found. |  -  |
|**404** | Project or Tag not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tagControllerFindOne**
> TagDto tagControllerFindOne()


### Example

```typescript
import {
    TagsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TagsApi(configuration);

let tagId: string; //Unique tag identifier (CUID) (default to undefined)
let projectId: string; //Project ID (default to undefined)

const { status, data } = await apiInstance.tagControllerFindOne(
    tagId,
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **tagId** | [**string**] | Unique tag identifier (CUID) | defaults to undefined|
| **projectId** | [**string**] | Project ID | defaults to undefined|


### Return type

**TagDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Tag found. |  -  |
|**404** | Project or Tag not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tagControllerRemove**
> TagDto tagControllerRemove()


### Example

```typescript
import {
    TagsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TagsApi(configuration);

let tagId: string; //ID único de la etiqueta a eliminar (CUID) (default to undefined)
let projectId: string; //ID del proyecto (default to undefined)

const { status, data } = await apiInstance.tagControllerRemove(
    tagId,
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **tagId** | [**string**] | ID único de la etiqueta a eliminar (CUID) | defaults to undefined|
| **projectId** | [**string**] | ID del proyecto | defaults to undefined|


### Return type

**TagDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Etiqueta eliminada. |  -  |
|**404** | Proyecto o Etiqueta no encontrada. |  -  |
|**409** | Conflicto, la etiqueta está en uso. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tagControllerUpdate**
> TagDto tagControllerUpdate(updateTagDto)


### Example

```typescript
import {
    TagsApi,
    Configuration,
    UpdateTagDto
} from './api';

const configuration = new Configuration();
const apiInstance = new TagsApi(configuration);

let tagId: string; //ID único de la etiqueta a actualizar (CUID) (default to undefined)
let projectId: string; //ID del proyecto (default to undefined)
let updateTagDto: UpdateTagDto; //

const { status, data } = await apiInstance.tagControllerUpdate(
    tagId,
    projectId,
    updateTagDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateTagDto** | **UpdateTagDto**|  | |
| **tagId** | [**string**] | ID único de la etiqueta a actualizar (CUID) | defaults to undefined|
| **projectId** | [**string**] | ID del proyecto | defaults to undefined|


### Return type

**TagDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Etiqueta actualizada. |  -  |
|**400** | Datos inválidos. |  -  |
|**404** | Proyecto o Etiqueta no encontrada. |  -  |
|**409** | Conflicto, ya existe una etiqueta con el nuevo nombre en el proyecto. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

