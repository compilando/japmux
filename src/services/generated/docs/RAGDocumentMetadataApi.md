# RAGDocumentMetadataApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**ragDocumentMetadataControllerCreate**](#ragdocumentmetadatacontrollercreate) | **POST** /api/projects/{projectId}/rag-document-metadata | Crear metadatos para un documento RAG dentro de un proyecto|
|[**ragDocumentMetadataControllerFindAll**](#ragdocumentmetadatacontrollerfindall) | **GET** /api/projects/{projectId}/rag-document-metadata | Obtener todos los metadatos de documentos RAG de un proyecto|
|[**ragDocumentMetadataControllerFindOne**](#ragdocumentmetadatacontrollerfindone) | **GET** /api/projects/{projectId}/rag-document-metadata/{metadataId} | Obtener metadatos por ID dentro de un proyecto|
|[**ragDocumentMetadataControllerRemove**](#ragdocumentmetadatacontrollerremove) | **DELETE** /api/projects/{projectId}/rag-document-metadata/{metadataId} | Eliminar metadatos por ID dentro de un proyecto|
|[**ragDocumentMetadataControllerUpdate**](#ragdocumentmetadatacontrollerupdate) | **PATCH** /api/projects/{projectId}/rag-document-metadata/{metadataId} | Actualizar metadatos por ID dentro de un proyecto|

# **ragDocumentMetadataControllerCreate**
> RagDocumentMetadataResponse ragDocumentMetadataControllerCreate(createRagDocumentMetadataDto)


### Example

```typescript
import {
    RAGDocumentMetadataApi,
    Configuration,
    CreateRagDocumentMetadataDto
} from './api';

const configuration = new Configuration();
const apiInstance = new RAGDocumentMetadataApi(configuration);

let projectId: string; //ID del proyecto (default to undefined)
let createRagDocumentMetadataDto: CreateRagDocumentMetadataDto; //

const { status, data } = await apiInstance.ragDocumentMetadataControllerCreate(
    projectId,
    createRagDocumentMetadataDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createRagDocumentMetadataDto** | **CreateRagDocumentMetadataDto**|  | |
| **projectId** | [**string**] | ID del proyecto | defaults to undefined|


### Return type

**RagDocumentMetadataResponse**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Metadatos creados. |  -  |
|**400** | Datos inválidos. |  -  |
|**404** | Proyecto o Región referenciada no encontrada. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **ragDocumentMetadataControllerFindAll**
> Array<RagDocumentMetadataResponse> ragDocumentMetadataControllerFindAll()


### Example

```typescript
import {
    RAGDocumentMetadataApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RAGDocumentMetadataApi(configuration);

let projectId: string; //ID del proyecto (default to undefined)

const { status, data } = await apiInstance.ragDocumentMetadataControllerFindAll(
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] | ID del proyecto | defaults to undefined|


### Return type

**Array<RagDocumentMetadataResponse>**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Lista de metadatos. |  -  |
|**404** | Proyecto no encontrado. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **ragDocumentMetadataControllerFindOne**
> RagDocumentMetadataResponse ragDocumentMetadataControllerFindOne()


### Example

```typescript
import {
    RAGDocumentMetadataApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RAGDocumentMetadataApi(configuration);

let metadataId: string; //ID de los metadatos (CUID) (default to undefined)
let projectId: string; //ID del proyecto (default to undefined)

const { status, data } = await apiInstance.ragDocumentMetadataControllerFindOne(
    metadataId,
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **metadataId** | [**string**] | ID de los metadatos (CUID) | defaults to undefined|
| **projectId** | [**string**] | ID del proyecto | defaults to undefined|


### Return type

**RagDocumentMetadataResponse**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Metadatos encontrados. |  -  |
|**404** | Proyecto o Metadatos no encontrados. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **ragDocumentMetadataControllerRemove**
> ragDocumentMetadataControllerRemove()


### Example

```typescript
import {
    RAGDocumentMetadataApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RAGDocumentMetadataApi(configuration);

let metadataId: string; //ID a eliminar (default to undefined)
let projectId: string; //ID del proyecto (default to undefined)

const { status, data } = await apiInstance.ragDocumentMetadataControllerRemove(
    metadataId,
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **metadataId** | [**string**] | ID a eliminar | defaults to undefined|
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
|**200** | Metadatos eliminados. |  -  |
|**404** | Proyecto o Metadatos no encontrados. |  -  |
|**409** | Conflicto al eliminar (referenciado por otras entidades). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **ragDocumentMetadataControllerUpdate**
> RagDocumentMetadataResponse ragDocumentMetadataControllerUpdate(body)


### Example

```typescript
import {
    RAGDocumentMetadataApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RAGDocumentMetadataApi(configuration);

let metadataId: string; //ID a actualizar (default to undefined)
let projectId: string; //ID del proyecto (default to undefined)
let body: object; //

const { status, data } = await apiInstance.ragDocumentMetadataControllerUpdate(
    metadataId,
    projectId,
    body
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **body** | **object**|  | |
| **metadataId** | [**string**] | ID a actualizar | defaults to undefined|
| **projectId** | [**string**] | ID del proyecto | defaults to undefined|


### Return type

**RagDocumentMetadataResponse**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Metadatos actualizados. |  -  |
|**400** | Datos inválidos. |  -  |
|**404** | Proyecto, Metadatos o Región referenciada no encontrada. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

