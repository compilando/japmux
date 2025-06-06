# AIModelsProjectSpecificApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**aiModelControllerCreate**](#aimodelcontrollercreate) | **POST** /api/projects/{projectId}/aimodels | Create a new AI model for this project|
|[**aiModelControllerFindAll**](#aimodelcontrollerfindall) | **GET** /api/projects/{projectId}/aimodels | Get all AI models for this project (includes global models)|
|[**aiModelControllerFindOne**](#aimodelcontrollerfindone) | **GET** /api/projects/{projectId}/aimodels/{aiModelId} | Get a specific AI model by ID (must belong to project or be global)|
|[**aiModelControllerGetProviderTypes**](#aimodelcontrollergetprovidertypes) | **GET** /api/projects/{projectId}/aimodels/providers/types | List available Langchain provider types|
|[**aiModelControllerRemove**](#aimodelcontrollerremove) | **DELETE** /api/projects/{projectId}/aimodels/{aiModelId} | Delete an AI model by ID (must belong to project)|
|[**aiModelControllerUpdate**](#aimodelcontrollerupdate) | **PATCH** /api/projects/{projectId}/aimodels/{aiModelId} | Update an AI model by ID (must belong to project)|

# **aiModelControllerCreate**
> AiModelResponseDto aiModelControllerCreate(createAiModelDto)


### Example

```typescript
import {
    AIModelsProjectSpecificApi,
    Configuration,
    CreateAiModelDto
} from './api';

const configuration = new Configuration();
const apiInstance = new AIModelsProjectSpecificApi(configuration);

let projectId: string; // (default to undefined)
let createAiModelDto: CreateAiModelDto; //

const { status, data } = await apiInstance.aiModelControllerCreate(
    projectId,
    createAiModelDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createAiModelDto** | **CreateAiModelDto**|  | |
| **projectId** | [**string**] |  | defaults to undefined|


### Return type

**AiModelResponseDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | The AI model has been successfully created. |  -  |
|**400** | Bad Request. |  -  |
|**409** | Conflict. AIModel with this name already exists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **aiModelControllerFindAll**
> Array<AiModelResponseDto> aiModelControllerFindAll()


### Example

```typescript
import {
    AIModelsProjectSpecificApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AIModelsProjectSpecificApi(configuration);

let projectId: string; // (default to undefined)

const { status, data } = await apiInstance.aiModelControllerFindAll(
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] |  | defaults to undefined|


### Return type

**Array<AiModelResponseDto>**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | List of project-specific and global AI models. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **aiModelControllerFindOne**
> AiModelResponseDto aiModelControllerFindOne()


### Example

```typescript
import {
    AIModelsProjectSpecificApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AIModelsProjectSpecificApi(configuration);

let projectId: string; //Project ID (default to undefined)
let aiModelId: string; //AI Model CUID (default to undefined)

const { status, data } = await apiInstance.aiModelControllerFindOne(
    projectId,
    aiModelId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] | Project ID | defaults to undefined|
| **aiModelId** | [**string**] | AI Model CUID | defaults to undefined|


### Return type

**AiModelResponseDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The found AI model record |  -  |
|**404** | AI Model not found or not accessible for this project. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **aiModelControllerGetProviderTypes**
> Array<string> aiModelControllerGetProviderTypes()


### Example

```typescript
import {
    AIModelsProjectSpecificApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AIModelsProjectSpecificApi(configuration);

let projectId: string; //The ID of the project (used for context/authorization, though the list is global) (default to undefined)

const { status, data } = await apiInstance.aiModelControllerGetProviderTypes(
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] | The ID of the project (used for context/authorization, though the list is global) | defaults to undefined|


### Return type

**Array<string>**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A list of Langchain provider types. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **aiModelControllerRemove**
> AiModelResponseDto aiModelControllerRemove()


### Example

```typescript
import {
    AIModelsProjectSpecificApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AIModelsProjectSpecificApi(configuration);

let projectId: string; //Project ID (default to undefined)
let aiModelId: string; //AI Model CUID (default to undefined)

const { status, data } = await apiInstance.aiModelControllerRemove(
    projectId,
    aiModelId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] | Project ID | defaults to undefined|
| **aiModelId** | [**string**] | AI Model CUID | defaults to undefined|


### Return type

**AiModelResponseDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The AI model has been successfully deleted. |  -  |
|**404** | AI Model not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **aiModelControllerUpdate**
> AiModelResponseDto aiModelControllerUpdate(updateAiModelDto)


### Example

```typescript
import {
    AIModelsProjectSpecificApi,
    Configuration,
    UpdateAiModelDto
} from './api';

const configuration = new Configuration();
const apiInstance = new AIModelsProjectSpecificApi(configuration);

let projectId: string; //Project ID (default to undefined)
let aiModelId: string; //AI Model CUID (default to undefined)
let updateAiModelDto: UpdateAiModelDto; //

const { status, data } = await apiInstance.aiModelControllerUpdate(
    projectId,
    aiModelId,
    updateAiModelDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateAiModelDto** | **UpdateAiModelDto**|  | |
| **projectId** | [**string**] | Project ID | defaults to undefined|
| **aiModelId** | [**string**] | AI Model CUID | defaults to undefined|


### Return type

**AiModelResponseDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The AI model has been successfully updated. |  -  |
|**400** | Bad Request. |  -  |
|**404** | AI Model not found. |  -  |
|**409** | Conflict. AIModel with this name already exists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

