# PromptVersionsWithinProjectPromptApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**promptVersionControllerCreate**](#promptversioncontrollercreate) | **POST** /api/projects/{projectId}/prompts/{promptId}/versions | Create a new version for a specific prompt within a project|
|[**promptVersionControllerFindAll**](#promptversioncontrollerfindall) | **GET** /api/projects/{projectId}/prompts/{promptId}/versions | Get all versions for a specific prompt within a project|
|[**promptVersionControllerFindOneByTag**](#promptversioncontrollerfindonebytag) | **GET** /api/projects/{projectId}/prompts/{promptId}/versions/{versionTag} | Get a specific prompt version by its tag within a project/prompt|
|[**promptVersionControllerRemove**](#promptversioncontrollerremove) | **DELETE** /api/projects/{projectId}/prompts/{promptId}/versions/{versionTag} | Delete a specific prompt version by its tag within a project/prompt|
|[**promptVersionControllerUpdate**](#promptversioncontrollerupdate) | **PATCH** /api/projects/{projectId}/prompts/{promptId}/versions/{versionTag} | Update a specific prompt version by its tag within a project/prompt|

# **promptVersionControllerCreate**
> CreatePromptVersionDto promptVersionControllerCreate(createPromptVersionDto)


### Example

```typescript
import {
    PromptVersionsWithinProjectPromptApi,
    Configuration,
    CreatePromptVersionDto
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptVersionsWithinProjectPromptApi(configuration);

let projectId: string; //Project ID (default to undefined)
let promptId: string; //Prompt CUID (default to undefined)
let createPromptVersionDto: CreatePromptVersionDto; //

const { status, data } = await apiInstance.promptVersionControllerCreate(
    projectId,
    promptId,
    createPromptVersionDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createPromptVersionDto** | **CreatePromptVersionDto**|  | |
| **projectId** | [**string**] | Project ID | defaults to undefined|
| **promptId** | [**string**] | Prompt CUID | defaults to undefined|


### Return type

**CreatePromptVersionDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Version created. |  -  |
|**400** | Invalid data (e.g., duplicate versionTag). |  -  |
|**401** | Unauthorized. |  -  |
|**403** | Forbidden Access to Project. |  -  |
|**404** | Project or Prompt not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **promptVersionControllerFindAll**
> Array<CreatePromptVersionDto> promptVersionControllerFindAll()


### Example

```typescript
import {
    PromptVersionsWithinProjectPromptApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptVersionsWithinProjectPromptApi(configuration);

let projectId: string; //Project ID (default to undefined)
let promptId: string; //Prompt CUID (default to undefined)

const { status, data } = await apiInstance.promptVersionControllerFindAll(
    projectId,
    promptId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] | Project ID | defaults to undefined|
| **promptId** | [**string**] | Prompt CUID | defaults to undefined|


### Return type

**Array<CreatePromptVersionDto>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | List of versions. |  -  |
|**401** | Unauthorized. |  -  |
|**403** | Forbidden Access to Project. |  -  |
|**404** | Project or Prompt not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **promptVersionControllerFindOneByTag**
> CreatePromptVersionDto promptVersionControllerFindOneByTag()


### Example

```typescript
import {
    PromptVersionsWithinProjectPromptApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptVersionsWithinProjectPromptApi(configuration);

let projectId: string; //Project ID (default to undefined)
let promptId: string; //Prompt CUID (default to undefined)
let versionTag: string; //Version tag (e.g., v1.0.0) (default to undefined)

const { status, data } = await apiInstance.promptVersionControllerFindOneByTag(
    projectId,
    promptId,
    versionTag
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] | Project ID | defaults to undefined|
| **promptId** | [**string**] | Prompt CUID | defaults to undefined|
| **versionTag** | [**string**] | Version tag (e.g., v1.0.0) | defaults to undefined|


### Return type

**CreatePromptVersionDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Version found. |  -  |
|**401** | Unauthorized. |  -  |
|**403** | Forbidden Access to Project. |  -  |
|**404** | Project, Prompt, or Version not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **promptVersionControllerRemove**
> promptVersionControllerRemove()


### Example

```typescript
import {
    PromptVersionsWithinProjectPromptApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptVersionsWithinProjectPromptApi(configuration);

let projectId: string; //Project ID (default to undefined)
let promptId: string; //Prompt CUID (default to undefined)
let versionTag: string; //Version tag to delete (default to undefined)

const { status, data } = await apiInstance.promptVersionControllerRemove(
    projectId,
    promptId,
    versionTag
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] | Project ID | defaults to undefined|
| **promptId** | [**string**] | Prompt CUID | defaults to undefined|
| **versionTag** | [**string**] | Version tag to delete | defaults to undefined|


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
|**200** | Version deleted. |  -  |
|**401** | Unauthorized. |  -  |
|**403** | Forbidden Access to Project. |  -  |
|**404** | Project, Prompt, or Version not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **promptVersionControllerUpdate**
> CreatePromptVersionDto promptVersionControllerUpdate(updatePromptVersionDto)


### Example

```typescript
import {
    PromptVersionsWithinProjectPromptApi,
    Configuration,
    UpdatePromptVersionDto
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptVersionsWithinProjectPromptApi(configuration);

let projectId: string; //Project ID (default to undefined)
let promptId: string; //Prompt CUID (default to undefined)
let versionTag: string; //Version tag to update (default to undefined)
let updatePromptVersionDto: UpdatePromptVersionDto; //

const { status, data } = await apiInstance.promptVersionControllerUpdate(
    projectId,
    promptId,
    versionTag,
    updatePromptVersionDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updatePromptVersionDto** | **UpdatePromptVersionDto**|  | |
| **projectId** | [**string**] | Project ID | defaults to undefined|
| **promptId** | [**string**] | Prompt CUID | defaults to undefined|
| **versionTag** | [**string**] | Version tag to update | defaults to undefined|


### Return type

**CreatePromptVersionDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Version updated. |  -  |
|**400** | Invalid data. |  -  |
|**401** | Unauthorized. |  -  |
|**403** | Forbidden Access to Project. |  -  |
|**404** | Project, Prompt, or Version not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

