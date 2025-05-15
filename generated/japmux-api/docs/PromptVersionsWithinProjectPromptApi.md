# PromptVersionsWithinProjectPromptApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**promptVersionControllerCreate**](#promptversioncontrollercreate) | **POST** /api/projects/{projectId}/prompts/{promptId}/versions | Create a new version for a specific prompt within a project|
|[**promptVersionControllerFindAll**](#promptversioncontrollerfindall) | **GET** /api/projects/{projectId}/prompts/{promptId}/versions | Get all versions for a specific prompt within a project|
|[**promptVersionControllerFindOneByTag**](#promptversioncontrollerfindonebytag) | **GET** /api/projects/{projectId}/prompts/{promptId}/versions/{versionTag} | Get a specific prompt version by its tag within a project/prompt. Allows resolving assets.|
|[**promptVersionControllerRemove**](#promptversioncontrollerremove) | **DELETE** /api/projects/{projectId}/prompts/{promptId}/versions/{versionTag} | Delete a specific prompt version by its tag within a project/prompt|
|[**promptVersionControllerRequestPublish**](#promptversioncontrollerrequestpublish) | **POST** /api/projects/{projectId}/prompts/{promptId}/versions/{versionTag}/request-publish | Request to publish a prompt version to the marketplace|
|[**promptVersionControllerUnpublish**](#promptversioncontrollerunpublish) | **POST** /api/projects/{projectId}/prompts/{promptId}/versions/{versionTag}/unpublish | Unpublish a prompt version from the marketplace|
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

[bearer](../README.md#bearer)

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

[bearer](../README.md#bearer)

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
let resolveAssets: boolean; //Whether to resolve asset placeholders. Defaults to false. (optional) (default to undefined)
let environmentId: string; //Environment ID for context. (optional) (default to undefined)
let regionCode: string; //Region code for context (e.g., for asset translations). (optional) (default to undefined)
let variables: string; //JSON stringified object of variables for substitution. (optional) (default to undefined)

const { status, data } = await apiInstance.promptVersionControllerFindOneByTag(
    projectId,
    promptId,
    versionTag,
    resolveAssets,
    environmentId,
    regionCode,
    variables
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] | Project ID | defaults to undefined|
| **promptId** | [**string**] | Prompt CUID | defaults to undefined|
| **versionTag** | [**string**] | Version tag (e.g., v1.0.0) | defaults to undefined|
| **resolveAssets** | [**boolean**] | Whether to resolve asset placeholders. Defaults to false. | (optional) defaults to undefined|
| **environmentId** | [**string**] | Environment ID for context. | (optional) defaults to undefined|
| **regionCode** | [**string**] | Region code for context (e.g., for asset translations). | (optional) defaults to undefined|
| **variables** | [**string**] | JSON stringified object of variables for substitution. | (optional) defaults to undefined|


### Return type

**CreatePromptVersionDto**

### Authorization

[bearer](../README.md#bearer)

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

[bearer](../README.md#bearer)

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

# **promptVersionControllerRequestPublish**
> CreatePromptVersionDto promptVersionControllerRequestPublish()


### Example

```typescript
import {
    PromptVersionsWithinProjectPromptApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptVersionsWithinProjectPromptApi(configuration);

let projectId: string; //Project ID (default to undefined)
let promptId: string; //Prompt ID (slug) (default to undefined)
let versionTag: string; //Version tag (default to undefined)

const { status, data } = await apiInstance.promptVersionControllerRequestPublish(
    projectId,
    promptId,
    versionTag
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] | Project ID | defaults to undefined|
| **promptId** | [**string**] | Prompt ID (slug) | defaults to undefined|
| **versionTag** | [**string**] | Version tag | defaults to undefined|


### Return type

**CreatePromptVersionDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Publish request processed. |  -  |
|**401** | Unauthorized. |  -  |
|**403** | Forbidden Access to Project. |  -  |
|**404** | Resource not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **promptVersionControllerUnpublish**
> CreatePromptVersionDto promptVersionControllerUnpublish()


### Example

```typescript
import {
    PromptVersionsWithinProjectPromptApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptVersionsWithinProjectPromptApi(configuration);

let projectId: string; //Project ID (default to undefined)
let promptId: string; //Prompt ID (slug) (default to undefined)
let versionTag: string; //Version tag (default to undefined)

const { status, data } = await apiInstance.promptVersionControllerUnpublish(
    projectId,
    promptId,
    versionTag
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] | Project ID | defaults to undefined|
| **promptId** | [**string**] | Prompt ID (slug) | defaults to undefined|
| **versionTag** | [**string**] | Version tag | defaults to undefined|


### Return type

**CreatePromptVersionDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Version unpublished. |  -  |
|**401** | Unauthorized. |  -  |
|**403** | Forbidden Access to Project. |  -  |
|**404** | Resource not found. |  -  |

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

[bearer](../README.md#bearer)

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

