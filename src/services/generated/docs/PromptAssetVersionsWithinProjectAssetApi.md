# PromptAssetVersionsWithinProjectAssetApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**promptAssetVersionControllerCreate**](#promptassetversioncontrollercreate) | **POST** /api/projects/{projectId}/assets/{assetKey}/versions | Create a new version for a specific asset within a project|
|[**promptAssetVersionControllerFindAll**](#promptassetversioncontrollerfindall) | **GET** /api/projects/{projectId}/assets/{assetKey}/versions | Get all versions for a specific asset within a project|
|[**promptAssetVersionControllerFindOneByTag**](#promptassetversioncontrollerfindonebytag) | **GET** /api/projects/{projectId}/assets/{assetKey}/versions/{versionTag} | Get a specific asset version by its tag within a project/asset|
|[**promptAssetVersionControllerRemove**](#promptassetversioncontrollerremove) | **DELETE** /api/projects/{projectId}/assets/{assetKey}/versions/{versionTag} | Delete a specific asset version by its tag within a project/asset|
|[**promptAssetVersionControllerUpdate**](#promptassetversioncontrollerupdate) | **PATCH** /api/projects/{projectId}/assets/{assetKey}/versions/{versionTag} | Update a specific asset version by its tag within a project/asset|

# **promptAssetVersionControllerCreate**
> CreatePromptAssetVersionDto promptAssetVersionControllerCreate(createPromptAssetVersionDto)


### Example

```typescript
import {
    PromptAssetVersionsWithinProjectAssetApi,
    Configuration,
    CreatePromptAssetVersionDto
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptAssetVersionsWithinProjectAssetApi(configuration);

let projectId: string; //Project ID (default to undefined)
let assetKey: string; //Asset Key (default to undefined)
let createPromptAssetVersionDto: CreatePromptAssetVersionDto; //

const { status, data } = await apiInstance.promptAssetVersionControllerCreate(
    projectId,
    assetKey,
    createPromptAssetVersionDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createPromptAssetVersionDto** | **CreatePromptAssetVersionDto**|  | |
| **projectId** | [**string**] | Project ID | defaults to undefined|
| **assetKey** | [**string**] | Asset Key | defaults to undefined|


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
    PromptAssetVersionsWithinProjectAssetApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptAssetVersionsWithinProjectAssetApi(configuration);

let projectId: string; //Project ID (default to undefined)
let assetKey: string; //Asset Key (default to undefined)

const { status, data } = await apiInstance.promptAssetVersionControllerFindAll(
    projectId,
    assetKey
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] | Project ID | defaults to undefined|
| **assetKey** | [**string**] | Asset Key | defaults to undefined|


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
    PromptAssetVersionsWithinProjectAssetApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptAssetVersionsWithinProjectAssetApi(configuration);

let projectId: string; //Project ID (default to undefined)
let assetKey: string; //Asset Key (default to undefined)
let versionTag: string; //Version tag (e.g., v1.0.0) (default to undefined)

const { status, data } = await apiInstance.promptAssetVersionControllerFindOneByTag(
    projectId,
    assetKey,
    versionTag
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] | Project ID | defaults to undefined|
| **assetKey** | [**string**] | Asset Key | defaults to undefined|
| **versionTag** | [**string**] | Version tag (e.g., v1.0.0) | defaults to undefined|


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
    PromptAssetVersionsWithinProjectAssetApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptAssetVersionsWithinProjectAssetApi(configuration);

let projectId: string; //Project ID (default to undefined)
let assetKey: string; //Asset Key (default to undefined)
let versionTag: string; //Version tag to delete (default to undefined)

const { status, data } = await apiInstance.promptAssetVersionControllerRemove(
    projectId,
    assetKey,
    versionTag
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] | Project ID | defaults to undefined|
| **assetKey** | [**string**] | Asset Key | defaults to undefined|
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

# **promptAssetVersionControllerUpdate**
> CreatePromptAssetVersionDto promptAssetVersionControllerUpdate(updatePromptAssetVersionDto)


### Example

```typescript
import {
    PromptAssetVersionsWithinProjectAssetApi,
    Configuration,
    UpdatePromptAssetVersionDto
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptAssetVersionsWithinProjectAssetApi(configuration);

let projectId: string; //Project ID (default to undefined)
let assetKey: string; //Asset Key (default to undefined)
let versionTag: string; //Version tag to update (default to undefined)
let updatePromptAssetVersionDto: UpdatePromptAssetVersionDto; //

const { status, data } = await apiInstance.promptAssetVersionControllerUpdate(
    projectId,
    assetKey,
    versionTag,
    updatePromptAssetVersionDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updatePromptAssetVersionDto** | **UpdatePromptAssetVersionDto**|  | |
| **projectId** | [**string**] | Project ID | defaults to undefined|
| **assetKey** | [**string**] | Asset Key | defaults to undefined|
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

