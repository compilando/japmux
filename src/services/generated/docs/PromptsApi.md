# PromptsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**promptControllerCreate**](#promptcontrollercreate) | **POST** /projects/{projectId}/prompts | Create a new prompt within a project|
|[**promptControllerGenerateStructure**](#promptcontrollergeneratestructure) | **POST** /projects/{projectId}/prompts/generate-structure | Analyzes a user prompt using an LLM and suggests a structure based on project entities.|
|[**promptControllerUpdate**](#promptcontrollerupdate) | **PATCH** /projects/{projectId}/prompts/{promptName} | Update an existing prompt by name|

# **promptControllerCreate**
> PromptDto promptControllerCreate(createPromptDto)


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

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | The prompt has been successfully created. |  -  |
|**400** | Bad Request. |  -  |
|**401** | Unauthorized. |  -  |
|**404** | Project not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **promptControllerGenerateStructure**
> object promptControllerGenerateStructure(generatePromptStructureDto)


### Example

```typescript
import {
    PromptsApi,
    Configuration,
    GeneratePromptStructureDto
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptsApi(configuration);

let projectId: string; //The ID of the project. (default to undefined)
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
| **projectId** | [**string**] | The ID of the project. | defaults to undefined|


### Return type

**object**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Returns the suggested JSON structure. |  -  |
|**400** | Bad Request (e.g., missing user prompt). |  -  |
|**401** | Unauthorized. |  -  |
|**404** | Project not found. |  -  |
|**500** | Internal Server Error (LLM failure, file read error, etc.). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **promptControllerUpdate**
> PromptDto promptControllerUpdate(updatePromptDto)


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
let promptName: string; // (default to undefined)
let updatePromptDto: UpdatePromptDto; //

const { status, data } = await apiInstance.promptControllerUpdate(
    projectId,
    promptName,
    updatePromptDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updatePromptDto** | **UpdatePromptDto**|  | |
| **projectId** | [**string**] |  | defaults to undefined|
| **promptName** | [**string**] |  | defaults to undefined|


### Return type

**PromptDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The prompt has been successfully updated. |  -  |
|**400** | Bad Request. |  -  |
|**401** | Unauthorized. |  -  |
|**404** | Prompt or Project not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

