# PromptsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**promptControllerCreate**](#promptcontrollercreate) | **POST** /api/projects/{projectId}/prompts | Create a new prompt|
|[**promptControllerFindAll**](#promptcontrollerfindall) | **GET** /api/projects/{projectId}/prompts | Get all prompts for a project|
|[**promptControllerFindOne**](#promptcontrollerfindone) | **GET** /api/projects/{projectId}/prompts/{id} | Get a specific prompt by ID|
|[**promptControllerGenerateStructure**](#promptcontrollergeneratestructure) | **POST** /api/projects/{projectId}/prompts/generate-structure | Generate a prompt structure from user input|
|[**promptControllerPartialUpdate**](#promptcontrollerpartialupdate) | **PATCH** /api/projects/{projectId}/prompts/{id} | Update a prompt (partial update)|
|[**promptControllerRemove**](#promptcontrollerremove) | **DELETE** /api/projects/{projectId}/prompts/{id} | Delete a prompt|
|[**promptControllerUpdate**](#promptcontrollerupdate) | **PUT** /api/projects/{projectId}/prompts/{id} | Update a prompt (full update)|

# **promptControllerCreate**
> promptControllerCreate(createPromptDto)


### Example

```typescript
import {
    PromptsApi,
    Configuration,
    CreatePromptDto
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptsApi(configuration);

let projectId: string; //Project ID (default to undefined)
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
| **projectId** | [**string**] | Project ID | defaults to undefined|


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
|**201** | Prompt created successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **promptControllerFindAll**
> promptControllerFindAll()


### Example

```typescript
import {
    PromptsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptsApi(configuration);

let projectId: string; //Project ID (default to undefined)

const { status, data } = await apiInstance.promptControllerFindAll(
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] | Project ID | defaults to undefined|


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
|**200** | List of prompts |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **promptControllerFindOne**
> promptControllerFindOne()


### Example

```typescript
import {
    PromptsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptsApi(configuration);

let id: string; //Prompt ID (default to undefined)
let projectId: string; //Project ID (default to undefined)

const { status, data } = await apiInstance.promptControllerFindOne(
    id,
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Prompt ID | defaults to undefined|
| **projectId** | [**string**] | Project ID | defaults to undefined|


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
|**200** | Prompt found successfully |  -  |
|**404** | Prompt not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **promptControllerGenerateStructure**
> promptControllerGenerateStructure(generatePromptStructureDto)


### Example

```typescript
import {
    PromptsApi,
    Configuration,
    GeneratePromptStructureDto
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptsApi(configuration);

let projectId: string; //Project ID (default to undefined)
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
| **projectId** | [**string**] | Project ID | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Prompt structure generated successfully |  -  |
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **promptControllerPartialUpdate**
> promptControllerPartialUpdate(updatePromptDto)


### Example

```typescript
import {
    PromptsApi,
    Configuration,
    UpdatePromptDto
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptsApi(configuration);

let id: string; //Prompt ID (default to undefined)
let projectId: string; //Project ID (default to undefined)
let updatePromptDto: UpdatePromptDto; //

const { status, data } = await apiInstance.promptControllerPartialUpdate(
    id,
    projectId,
    updatePromptDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updatePromptDto** | **UpdatePromptDto**|  | |
| **id** | [**string**] | Prompt ID | defaults to undefined|
| **projectId** | [**string**] | Project ID | defaults to undefined|


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
|**200** | Prompt updated successfully |  -  |

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

let id: string; //Prompt ID (default to undefined)
let projectId: string; //Project ID (default to undefined)

const { status, data } = await apiInstance.promptControllerRemove(
    id,
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Prompt ID | defaults to undefined|
| **projectId** | [**string**] | Project ID | defaults to undefined|


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
|**200** | Prompt deleted successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **promptControllerUpdate**
> promptControllerUpdate(updatePromptDto)


### Example

```typescript
import {
    PromptsApi,
    Configuration,
    UpdatePromptDto
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptsApi(configuration);

let id: string; //Prompt ID (default to undefined)
let projectId: string; //Project ID (default to undefined)
let updatePromptDto: UpdatePromptDto; //

const { status, data } = await apiInstance.promptControllerUpdate(
    id,
    projectId,
    updatePromptDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updatePromptDto** | **UpdatePromptDto**|  | |
| **id** | [**string**] | Prompt ID | defaults to undefined|
| **projectId** | [**string**] | Project ID | defaults to undefined|


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
|**200** | Prompt updated successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

