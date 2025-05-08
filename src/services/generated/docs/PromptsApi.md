# PromptsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**promptControllerAddOrUpdateTranslation**](#promptcontrolleraddorupdatetranslation) | **PUT** /api/projects/{projectId}/prompts/{promptName}/versions/{versionId}/translations | Adds or updates a translation for a specific prompt version in the project.|
|[**promptControllerCreate**](#promptcontrollercreate) | **POST** /api/projects/{projectId}/prompts | Creates a new logical prompt within a project|
|[**promptControllerFindAll**](#promptcontrollerfindall) | **GET** /api/projects/{projectId}/prompts | Gets all logical prompts for a project|
|[**promptControllerFindOne**](#promptcontrollerfindone) | **GET** /api/projects/{projectId}/prompts/{promptName} | Gets a logical prompt by its name within a project|
|[**promptControllerRemove**](#promptcontrollerremove) | **DELETE** /api/projects/{projectId}/prompts/{promptName} | Deletes a logical prompt (and its associated versions via Cascade) within a project by name|
|[**promptControllerUpdate**](#promptcontrollerupdate) | **PATCH** /api/projects/{projectId}/prompts/{promptName} | Updates an existing prompt by its name for a specific project|

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

let versionId: string; //ID of the version to translate (CUID) (default to undefined)
let promptName: string; //Parent prompt name (contextual) (default to undefined)
let projectId: string; //Project ID (default to undefined)
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
| **versionId** | [**string**] | ID of the version to translate (CUID) | defaults to undefined|
| **promptName** | [**string**] | Parent prompt name (contextual) | defaults to undefined|
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
|**200** | Translation created or updated. |  -  |
|**400** | Invalid data. |  -  |
|**404** | Project or Version not found. |  -  |

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

**CreatePromptDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Prompt created. |  -  |
|**400** | Invalid data (e.g., missing initial promptText). |  -  |
|**404** | Project or Tag not found. |  -  |
|**409** | Conflict, a prompt with this name already exists in the project. |  -  |

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

**Array<CreatePromptDto>**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | List of prompts. |  -  |
|**404** | Project not found. |  -  |

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

let promptName: string; //Unique name of the prompt within the project (default to undefined)
let projectId: string; //Project ID (default to undefined)

const { status, data } = await apiInstance.promptControllerFindOne(
    promptName,
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **promptName** | [**string**] | Unique name of the prompt within the project | defaults to undefined|
| **projectId** | [**string**] | Project ID | defaults to undefined|


### Return type

**CreatePromptDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Prompt found. |  -  |
|**404** | Project or Prompt not found. |  -  |

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

let promptName: string; //Name of the prompt to delete (default to undefined)
let projectId: string; //Project ID (default to undefined)

const { status, data } = await apiInstance.promptControllerRemove(
    promptName,
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **promptName** | [**string**] | Name of the prompt to delete | defaults to undefined|
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
|**200** | Prompt deleted. |  -  |
|**404** | Project or Prompt not found. |  -  |
|**409** | Conflict on deletion (check non-cascading relations). |  -  |

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

let promptName: string; //Name of the prompt to update (default to undefined)
let projectId: string; //Project ID (default to undefined)
let updatePromptDto: UpdatePromptDto; //Data to update the prompt

const { status, data } = await apiInstance.promptControllerUpdate(
    promptName,
    projectId,
    updatePromptDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updatePromptDto** | **UpdatePromptDto**| Data to update the prompt | |
| **promptName** | [**string**] | Name of the prompt to update | defaults to undefined|
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
|**200** | Prompt updated successfully. |  -  |
|**400** | Invalid data. |  -  |
|**404** | Project, Prompt, or Tag not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

