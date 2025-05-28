# PromptsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**promptControllerCreate**](#promptcontrollercreate) | **POST** /api/projects/{projectId}/prompts | Create new prompt|
|[**promptControllerCreateBackup**](#promptcontrollercreatebackup) | **POST** /api/projects/{projectId}/prompts/{id}/backup | Create prompt backup|
|[**promptControllerFindAll**](#promptcontrollerfindall) | **GET** /api/projects/{projectId}/prompts | Get all prompts|
|[**promptControllerFindOne**](#promptcontrollerfindone) | **GET** /api/projects/{projectId}/prompts/{id} | Get prompt by ID|
|[**promptControllerGenerateStructure**](#promptcontrollergeneratestructure) | **POST** /api/projects/{projectId}/prompts/generate-structure | Genera estructura de prompt|
|[**promptControllerGenerateStructureAI**](#promptcontrollergeneratestructureai) | **POST** /api/projects/{projectId}/prompts/{id}/generate-structure | Generate prompt structure using AI|
|[**promptControllerListBackups**](#promptcontrollerlistbackups) | **GET** /api/projects/{projectId}/prompts/backups/list | List prompt backups|
|[**promptControllerLoadStructure**](#promptcontrollerloadstructure) | **POST** /api/projects/{projectId}/prompts/{id}/load-structure | Load prompt structure|
|[**promptControllerLoadStructureComplete**](#promptcontrollerloadstructurecomplete) | **POST** /api/projects/{projectId}/prompts/load-structure | Load complete prompt structure|
|[**promptControllerRemove**](#promptcontrollerremove) | **DELETE** /api/projects/{projectId}/prompts/{id} | Delete prompt|
|[**promptControllerUpdate**](#promptcontrollerupdate) | **PATCH** /api/projects/{projectId}/prompts/{id} | Update prompt|

# **promptControllerCreate**
> PromptDto promptControllerCreate(createPromptDto)

Creates a new prompt for the current tenant. Accessible by global admins or tenant admins.

### Example

```typescript
import {
    PromptsApi,
    Configuration,
    CreatePromptDto
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptsApi(configuration);

let projectId: string; // (default to undefined)
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
| **projectId** | [**string**] |  | defaults to undefined|


### Return type

**PromptDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Prompt successfully created |  -  |
|**400** | Invalid input data - Check the request body format |  -  |
|**401** | Unauthorized - Invalid or expired token |  -  |
|**403** | Forbidden - Insufficient permissions to create prompts |  -  |
|**409** | Prompt already exists - A prompt with this name already exists for this tenant |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **promptControllerCreateBackup**
> promptControllerCreateBackup(createPromptBackupRequestDto)

Creates a complete backup of a prompt without deleting it.

### Example

```typescript
import {
    PromptsApi,
    Configuration,
    CreatePromptBackupRequestDto
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptsApi(configuration);

let projectId: string; //ID of the project the prompt belongs to (default to undefined)
let id: string; //Unique prompt identifier to backup (default to undefined)
let createPromptBackupRequestDto: CreatePromptBackupRequestDto; //

const { status, data } = await apiInstance.promptControllerCreateBackup(
    projectId,
    id,
    createPromptBackupRequestDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createPromptBackupRequestDto** | **CreatePromptBackupRequestDto**|  | |
| **projectId** | [**string**] | ID of the project the prompt belongs to | defaults to undefined|
| **id** | [**string**] | Unique prompt identifier to backup | defaults to undefined|


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
|**201** | Backup created successfully. |  -  |
|**401** | Unauthorized. |  -  |
|**403** | Forbidden Access to Project. |  -  |
|**404** | Prompt not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **promptControllerFindAll**
> Array<PromptDto> promptControllerFindAll()

Retrieves a list of all prompts for the current tenant. Results are cached for 1 hour.

### Example

```typescript
import {
    PromptsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptsApi(configuration);

let projectId: string; // (default to undefined)

const { status, data } = await apiInstance.promptControllerFindAll(
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] |  | defaults to undefined|


### Return type

**Array<PromptDto>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | List of prompts retrieved successfully |  -  |
|**401** | Unauthorized - Invalid or expired token |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **promptControllerFindOne**
> PromptDto promptControllerFindOne()

Retrieves a specific prompt by its unique ID. Results are cached for 1 hour.

### Example

```typescript
import {
    PromptsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptsApi(configuration);

let projectId: string; // (default to undefined)
let id: string; //Unique prompt identifier (slug) (default to undefined)

const { status, data } = await apiInstance.promptControllerFindOne(
    projectId,
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] |  | defaults to undefined|
| **id** | [**string**] | Unique prompt identifier (slug) | defaults to undefined|


### Return type

**PromptDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Prompt found successfully |  -  |
|**401** | Unauthorized - Invalid or expired token |  -  |
|**404** | Prompt not found - The specified ID does not exist for this tenant |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **promptControllerGenerateStructure**
> PromptControllerGenerateStructure200Response promptControllerGenerateStructure(generatePromptStructureDto)

Analiza un prompt de usuario usando un LLM y sugiere una estructura basada en las entidades del proyecto.

### Example

```typescript
import {
    PromptsApi,
    Configuration,
    GeneratePromptStructureDto
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptsApi(configuration);

let projectId: string; //ID del proyecto (default to undefined)
let generatePromptStructureDto: GeneratePromptStructureDto; //

const { status, data } = await apiInstance.promptControllerGenerateStructure(
    projectId,
    generatePromptStructureDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **generatePromptStructureDto** | **GeneratePromptStructureDto**|  | |
| **projectId** | [**string**] | ID del proyecto | defaults to undefined|


### Return type

**PromptControllerGenerateStructure200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Estructura JSON sugerida para el prompt |  -  |
|**400** | Datos de entrada inválidos |  -  |
|**401** | No autorizado |  -  |
|**404** | Proyecto no encontrado |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **promptControllerGenerateStructureAI**
> promptControllerGenerateStructureAI(promptControllerGenerateStructureAIRequest)

Uses AI to analyze a basic prompt and suggest a complete structure with versions, translations, and assets.

### Example

```typescript
import {
    PromptsApi,
    Configuration,
    PromptControllerGenerateStructureAIRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptsApi(configuration);

let projectId: string; //ID of the project for context (default to undefined)
let id: any; //Base prompt text or identifier (default to undefined)
let promptControllerGenerateStructureAIRequest: PromptControllerGenerateStructureAIRequest; //

const { status, data } = await apiInstance.promptControllerGenerateStructureAI(
    projectId,
    id,
    promptControllerGenerateStructureAIRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **promptControllerGenerateStructureAIRequest** | **PromptControllerGenerateStructureAIRequest**|  | |
| **projectId** | [**string**] | ID of the project for context | defaults to undefined|
| **id** | **any** | Base prompt text or identifier | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | AI-generated structure suggestion. |  -  |
|**201** |  |  -  |
|**400** | Invalid prompt text. |  -  |
|**401** | Unauthorized. |  -  |
|**403** | Forbidden Access to Project. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **promptControllerListBackups**
> promptControllerListBackups()

Lists all available prompt backups for the project.

### Example

```typescript
import {
    PromptsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptsApi(configuration);

let projectId: string; //ID of the project to list backups for (default to undefined)

const { status, data } = await apiInstance.promptControllerListBackups(
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] | ID of the project to list backups for | defaults to undefined|


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
|**200** | List of available backups. |  -  |
|**401** | Unauthorized. |  -  |
|**403** | Forbidden Access to Project. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **promptControllerLoadStructure**
> promptControllerLoadStructure()


### Example

```typescript
import {
    PromptsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptsApi(configuration);

let id: string; //ID of the prompt (default to undefined)
let projectId: string; //ID of the project (default to undefined)

const { status, data } = await apiInstance.promptControllerLoadStructure(
    id,
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | ID of the prompt | defaults to undefined|
| **projectId** | [**string**] | ID of the project | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Prompt structure loaded successfully |  -  |
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **promptControllerLoadStructureComplete**
> promptControllerLoadStructureComplete(loadPromptStructureDto)

Creates a complete prompt with all its components (versions, translations, assets) from a structured input.

### Example

```typescript
import {
    PromptsApi,
    Configuration,
    LoadPromptStructureDto
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptsApi(configuration);

let projectId: string; //ID of the project where the structure will be loaded (default to undefined)
let loadPromptStructureDto: LoadPromptStructureDto; //

const { status, data } = await apiInstance.promptControllerLoadStructureComplete(
    projectId,
    loadPromptStructureDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **loadPromptStructureDto** | **LoadPromptStructureDto**|  | |
| **projectId** | [**string**] | ID of the project where the structure will be loaded | defaults to undefined|


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
|**201** | Prompt structure loaded successfully. |  -  |
|**400** | Invalid structure data. |  -  |
|**401** | Unauthorized. |  -  |
|**403** | Forbidden Access to Project. |  -  |
|**409** | Prompt or components already exist. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **promptControllerRemove**
> promptControllerRemove()

Permanently deletes a prompt. This is a destructive operation that requires admin privileges.

### Example

```typescript
import {
    PromptsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptsApi(configuration);

let projectId: string; // (default to undefined)
let id: string; //Unique prompt identifier to delete (slug or UUID) (default to undefined)

const { status, data } = await apiInstance.promptControllerRemove(
    projectId,
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] |  | defaults to undefined|
| **id** | [**string**] | Unique prompt identifier to delete (slug or UUID) | defaults to undefined|


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
|**204** | Prompt successfully deleted |  -  |
|**401** | Unauthorized - Invalid or expired token |  -  |
|**403** | Forbidden - Insufficient permissions to delete prompts |  -  |
|**404** | Prompt not found - The specified ID does not exist for this tenant |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **promptControllerUpdate**
> PromptDto promptControllerUpdate(updatePromptDto)

Updates an existing prompt\'s information. Accessible by global admins or tenant admins.

### Example

```typescript
import {
    PromptsApi,
    Configuration,
    UpdatePromptDto
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptsApi(configuration);

let projectId: string; // (default to undefined)
let id: string; //Unique prompt identifier to update (slug or UUID) (default to undefined)
let updatePromptDto: UpdatePromptDto; //

const { status, data } = await apiInstance.promptControllerUpdate(
    projectId,
    id,
    updatePromptDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updatePromptDto** | **UpdatePromptDto**|  | |
| **projectId** | [**string**] |  | defaults to undefined|
| **id** | [**string**] | Unique prompt identifier to update (slug or UUID) | defaults to undefined|


### Return type

**PromptDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Prompt updated successfully |  -  |
|**400** | Invalid input data - Check the request body format |  -  |
|**401** | Unauthorized - Invalid or expired token |  -  |
|**403** | Forbidden - Insufficient permissions to update prompts |  -  |
|**404** | Prompt not found - The specified ID does not exist for this tenant |  -  |
|**409** | Prompt name already exists - The provided name is already in use |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

