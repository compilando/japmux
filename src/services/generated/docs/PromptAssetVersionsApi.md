# PromptAssetVersionsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**promptAssetVersionControllerCreate**](#promptassetversioncontrollercreate) | **POST** /api/projects/{projectId}/prompts/{promptId}/assets/{assetKey}/versions | Create a new version for a specific prompt asset|
|[**promptAssetVersionControllerFindAll**](#promptassetversioncontrollerfindall) | **GET** /api/projects/{projectId}/prompts/{promptId}/assets/{assetKey}/versions | Get all versions for a specific prompt asset|
|[**promptAssetVersionControllerFindOneByTag**](#promptassetversioncontrollerfindonebytag) | **GET** /api/projects/{projectId}/prompts/{promptId}/assets/{assetKey}/versions/{versionTag} | Get a specific prompt asset version by its tag|
|[**promptAssetVersionControllerRemove**](#promptassetversioncontrollerremove) | **DELETE** /api/projects/{projectId}/prompts/{promptId}/assets/{assetKey}/versions/{versionTag} | Delete a specific prompt asset version by its tag|
|[**promptAssetVersionControllerRequestPublish**](#promptassetversioncontrollerrequestpublish) | **POST** /api/projects/{projectId}/prompts/{promptId}/assets/{assetKey}/versions/{versionTag}/request-publish | Request to publish an asset version to the marketplace|
|[**promptAssetVersionControllerUnpublish**](#promptassetversioncontrollerunpublish) | **POST** /api/projects/{projectId}/prompts/{promptId}/assets/{assetKey}/versions/{versionTag}/unpublish | Unpublish an asset version from the marketplace|
|[**promptAssetVersionControllerUpdate**](#promptassetversioncontrollerupdate) | **PATCH** /api/projects/{projectId}/prompts/{promptId}/assets/{assetKey}/versions/{versionTag} | Update a specific prompt asset version by its tag|

# **promptAssetVersionControllerCreate**
> CreatePromptAssetVersionDto promptAssetVersionControllerCreate(createPromptAssetVersionDto)


### Example

```typescript
import {
    PromptAssetVersionsApi,
    Configuration,
    CreatePromptAssetVersionDto
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptAssetVersionsApi(configuration);

let projectId: string; //ID of the Project the Prompt belongs to (default to undefined)
let promptId: string; //ID (slug) of the Prompt (default to undefined)
let assetKey: string; //Key of the PromptAsset (default to undefined)
let createPromptAssetVersionDto: CreatePromptAssetVersionDto; //

const { status, data } = await apiInstance.promptAssetVersionControllerCreate(
    projectId,
    promptId,
    assetKey,
    createPromptAssetVersionDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createPromptAssetVersionDto** | **CreatePromptAssetVersionDto**|  | |
| **projectId** | [**string**] | ID of the Project the Prompt belongs to | defaults to undefined|
| **promptId** | [**string**] | ID (slug) of the Prompt | defaults to undefined|
| **assetKey** | [**string**] | Key of the PromptAsset | defaults to undefined|


### Return type

**CreatePromptAssetVersionDto**

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
|**404** | Project or Asset not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **promptAssetVersionControllerFindAll**
> Array<CreatePromptAssetVersionDto> promptAssetVersionControllerFindAll()


### Example

```typescript
import {
    PromptAssetVersionsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptAssetVersionsApi(configuration);

let projectId: string; //ID of the Project the Prompt belongs to (default to undefined)
let promptId: string; //ID (slug) of the Prompt (default to undefined)
let assetKey: string; //Key of the PromptAsset (default to undefined)
let languageCode: string; // (default to undefined)

const { status, data } = await apiInstance.promptAssetVersionControllerFindAll(
    projectId,
    promptId,
    assetKey,
    languageCode
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] | ID of the Project the Prompt belongs to | defaults to undefined|
| **promptId** | [**string**] | ID (slug) of the Prompt | defaults to undefined|
| **assetKey** | [**string**] | Key of the PromptAsset | defaults to undefined|
| **languageCode** | [**string**] |  | defaults to undefined|


### Return type

**Array<CreatePromptAssetVersionDto>**

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
|**404** | Project or Asset not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **promptAssetVersionControllerFindOneByTag**
> CreatePromptAssetVersionDto promptAssetVersionControllerFindOneByTag()


### Example

```typescript
import {
    PromptAssetVersionsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptAssetVersionsApi(configuration);

let projectId: string; //ID of the Project the Prompt belongs to (default to undefined)
let promptId: string; //ID (slug) of the Prompt (default to undefined)
let assetKey: string; //Key of the PromptAsset (default to undefined)
let versionTag: string; //Version tag (e.g., v1.0.0) (default to undefined)
let languageCode: string; // (default to undefined)

const { status, data } = await apiInstance.promptAssetVersionControllerFindOneByTag(
    projectId,
    promptId,
    assetKey,
    versionTag,
    languageCode
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] | ID of the Project the Prompt belongs to | defaults to undefined|
| **promptId** | [**string**] | ID (slug) of the Prompt | defaults to undefined|
| **assetKey** | [**string**] | Key of the PromptAsset | defaults to undefined|
| **versionTag** | [**string**] | Version tag (e.g., v1.0.0) | defaults to undefined|
| **languageCode** | [**string**] |  | defaults to undefined|


### Return type

**CreatePromptAssetVersionDto**

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
|**404** | Project, Asset, or Version not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **promptAssetVersionControllerRemove**
> promptAssetVersionControllerRemove()


### Example

```typescript
import {
    PromptAssetVersionsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptAssetVersionsApi(configuration);

let projectId: string; //ID of the Project the Prompt belongs to (default to undefined)
let promptId: string; //ID (slug) of the Prompt (default to undefined)
let assetKey: string; //Key of the PromptAsset (default to undefined)
let versionTag: string; //Version tag to delete (default to undefined)

const { status, data } = await apiInstance.promptAssetVersionControllerRemove(
    projectId,
    promptId,
    assetKey,
    versionTag
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] | ID of the Project the Prompt belongs to | defaults to undefined|
| **promptId** | [**string**] | ID (slug) of the Prompt | defaults to undefined|
| **assetKey** | [**string**] | Key of the PromptAsset | defaults to undefined|
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
|**404** | Project, Asset, or Version not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **promptAssetVersionControllerRequestPublish**
> CreatePromptAssetVersionDto promptAssetVersionControllerRequestPublish()


### Example

```typescript
import {
    PromptAssetVersionsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptAssetVersionsApi(configuration);

let projectId: string; //ID of the Project the Prompt belongs to (default to undefined)
let promptId: string; //ID (slug) of the Prompt (default to undefined)
let assetKey: string; //Key of the PromptAsset (default to undefined)
let versionTag: string; //Version tag (default to undefined)

const { status, data } = await apiInstance.promptAssetVersionControllerRequestPublish(
    projectId,
    promptId,
    assetKey,
    versionTag
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] | ID of the Project the Prompt belongs to | defaults to undefined|
| **promptId** | [**string**] | ID (slug) of the Prompt | defaults to undefined|
| **assetKey** | [**string**] | Key of the PromptAsset | defaults to undefined|
| **versionTag** | [**string**] | Version tag | defaults to undefined|


### Return type

**CreatePromptAssetVersionDto**

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

# **promptAssetVersionControllerUnpublish**
> CreatePromptAssetVersionDto promptAssetVersionControllerUnpublish()


### Example

```typescript
import {
    PromptAssetVersionsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptAssetVersionsApi(configuration);

let projectId: string; //ID of the Project the Prompt belongs to (default to undefined)
let promptId: string; //ID (slug) of the Prompt (default to undefined)
let assetKey: string; //Key of the PromptAsset (default to undefined)
let versionTag: string; //Version tag (default to undefined)

const { status, data } = await apiInstance.promptAssetVersionControllerUnpublish(
    projectId,
    promptId,
    assetKey,
    versionTag
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] | ID of the Project the Prompt belongs to | defaults to undefined|
| **promptId** | [**string**] | ID (slug) of the Prompt | defaults to undefined|
| **assetKey** | [**string**] | Key of the PromptAsset | defaults to undefined|
| **versionTag** | [**string**] | Version tag | defaults to undefined|


### Return type

**CreatePromptAssetVersionDto**

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

# **promptAssetVersionControllerUpdate**
> CreatePromptAssetVersionDto promptAssetVersionControllerUpdate(updatePromptAssetVersionDto)


### Example

```typescript
import {
    PromptAssetVersionsApi,
    Configuration,
    UpdatePromptAssetVersionDto
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptAssetVersionsApi(configuration);

let projectId: string; //ID of the Project the Prompt belongs to (default to undefined)
let promptId: string; //ID (slug) of the Prompt (default to undefined)
let assetKey: string; //Key of the PromptAsset (default to undefined)
let versionTag: string; //Version tag to update (default to undefined)
let updatePromptAssetVersionDto: UpdatePromptAssetVersionDto; //

const { status, data } = await apiInstance.promptAssetVersionControllerUpdate(
    projectId,
    promptId,
    assetKey,
    versionTag,
    updatePromptAssetVersionDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updatePromptAssetVersionDto** | **UpdatePromptAssetVersionDto**|  | |
| **projectId** | [**string**] | ID of the Project the Prompt belongs to | defaults to undefined|
| **promptId** | [**string**] | ID (slug) of the Prompt | defaults to undefined|
| **assetKey** | [**string**] | Key of the PromptAsset | defaults to undefined|
| **versionTag** | [**string**] | Version tag to update | defaults to undefined|


### Return type

**CreatePromptAssetVersionDto**

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
|**404** | Project, Asset, or Version not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

