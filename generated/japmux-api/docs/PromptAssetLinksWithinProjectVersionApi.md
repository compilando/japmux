# PromptAssetLinksWithinProjectVersionApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**promptAssetLinkControllerCreate**](#promptassetlinkcontrollercreate) | **POST** /api/projects/{projectId}/prompt-versions/{promptVersionId}/links | Link an Asset Version to a Prompt Version within a Project|
|[**promptAssetLinkControllerFindAll**](#promptassetlinkcontrollerfindall) | **GET** /api/projects/{projectId}/prompt-versions/{promptVersionId}/links | Get all links for a specific Prompt Version within a Project|
|[**promptAssetLinkControllerFindOne**](#promptassetlinkcontrollerfindone) | **GET** /api/projects/{projectId}/prompt-versions/{promptVersionId}/links/{linkId} | Get a specific link by its ID for a Prompt Version within a Project|
|[**promptAssetLinkControllerRemove**](#promptassetlinkcontrollerremove) | **DELETE** /api/projects/{projectId}/prompt-versions/{promptVersionId}/links/{linkId} | Delete a specific link by its ID for a Prompt Version within a Project|
|[**promptAssetLinkControllerUpdate**](#promptassetlinkcontrollerupdate) | **PATCH** /api/projects/{projectId}/prompt-versions/{promptVersionId}/links/{linkId} | Update a specific link by its ID for a Prompt Version within a Project|

# **promptAssetLinkControllerCreate**
> CreatePromptAssetLinkDto promptAssetLinkControllerCreate(createPromptAssetLinkDto)


### Example

```typescript
import {
    PromptAssetLinksWithinProjectVersionApi,
    Configuration,
    CreatePromptAssetLinkDto
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptAssetLinksWithinProjectVersionApi(configuration);

let projectId: string; //Project ID (default to undefined)
let promptVersionId: string; //Prompt Version ID (default to undefined)
let createPromptAssetLinkDto: CreatePromptAssetLinkDto; //

const { status, data } = await apiInstance.promptAssetLinkControllerCreate(
    projectId,
    promptVersionId,
    createPromptAssetLinkDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createPromptAssetLinkDto** | **CreatePromptAssetLinkDto**|  | |
| **projectId** | [**string**] | Project ID | defaults to undefined|
| **promptVersionId** | [**string**] | Prompt Version ID | defaults to undefined|


### Return type

**CreatePromptAssetLinkDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Link created. |  -  |
|**400** | Invalid data. |  -  |
|**401** | Unauthorized. |  -  |
|**403** | Forbidden Access to Project. |  -  |
|**404** | Project, Prompt Version, or Asset Version not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **promptAssetLinkControllerFindAll**
> Array<CreatePromptAssetLinkDto> promptAssetLinkControllerFindAll()


### Example

```typescript
import {
    PromptAssetLinksWithinProjectVersionApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptAssetLinksWithinProjectVersionApi(configuration);

let projectId: string; //Project ID (default to undefined)
let promptVersionId: string; //Prompt Version ID (default to undefined)

const { status, data } = await apiInstance.promptAssetLinkControllerFindAll(
    projectId,
    promptVersionId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] | Project ID | defaults to undefined|
| **promptVersionId** | [**string**] | Prompt Version ID | defaults to undefined|


### Return type

**Array<CreatePromptAssetLinkDto>**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | List of links. |  -  |
|**401** | Unauthorized. |  -  |
|**403** | Forbidden Access to Project. |  -  |
|**404** | Project or Prompt Version not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **promptAssetLinkControllerFindOne**
> CreatePromptAssetLinkDto promptAssetLinkControllerFindOne()


### Example

```typescript
import {
    PromptAssetLinksWithinProjectVersionApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptAssetLinksWithinProjectVersionApi(configuration);

let projectId: string; //Project ID (default to undefined)
let promptVersionId: string; //Prompt Version ID (default to undefined)
let linkId: string; //Link ID (default to undefined)

const { status, data } = await apiInstance.promptAssetLinkControllerFindOne(
    projectId,
    promptVersionId,
    linkId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] | Project ID | defaults to undefined|
| **promptVersionId** | [**string**] | Prompt Version ID | defaults to undefined|
| **linkId** | [**string**] | Link ID | defaults to undefined|


### Return type

**CreatePromptAssetLinkDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Link found. |  -  |
|**401** | Unauthorized. |  -  |
|**403** | Forbidden Access to Project. |  -  |
|**404** | Project, Prompt Version, or Link not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **promptAssetLinkControllerRemove**
> promptAssetLinkControllerRemove()


### Example

```typescript
import {
    PromptAssetLinksWithinProjectVersionApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptAssetLinksWithinProjectVersionApi(configuration);

let projectId: string; //Project ID (default to undefined)
let promptVersionId: string; //Prompt Version ID (default to undefined)
let linkId: string; //Link ID (default to undefined)

const { status, data } = await apiInstance.promptAssetLinkControllerRemove(
    projectId,
    promptVersionId,
    linkId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] | Project ID | defaults to undefined|
| **promptVersionId** | [**string**] | Prompt Version ID | defaults to undefined|
| **linkId** | [**string**] | Link ID | defaults to undefined|


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
|**200** | Link deleted. |  -  |
|**401** | Unauthorized. |  -  |
|**403** | Forbidden Access to Project. |  -  |
|**404** | Project, Prompt Version, or Link not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **promptAssetLinkControllerUpdate**
> CreatePromptAssetLinkDto promptAssetLinkControllerUpdate(updatePromptAssetLinkDto)


### Example

```typescript
import {
    PromptAssetLinksWithinProjectVersionApi,
    Configuration,
    UpdatePromptAssetLinkDto
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptAssetLinksWithinProjectVersionApi(configuration);

let projectId: string; //Project ID (default to undefined)
let promptVersionId: string; //Prompt Version ID (default to undefined)
let linkId: string; //Link ID (default to undefined)
let updatePromptAssetLinkDto: UpdatePromptAssetLinkDto; //

const { status, data } = await apiInstance.promptAssetLinkControllerUpdate(
    projectId,
    promptVersionId,
    linkId,
    updatePromptAssetLinkDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updatePromptAssetLinkDto** | **UpdatePromptAssetLinkDto**|  | |
| **projectId** | [**string**] | Project ID | defaults to undefined|
| **promptVersionId** | [**string**] | Prompt Version ID | defaults to undefined|
| **linkId** | [**string**] | Link ID | defaults to undefined|


### Return type

**CreatePromptAssetLinkDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Link updated. |  -  |
|**400** | Invalid data. |  -  |
|**401** | Unauthorized. |  -  |
|**403** | Forbidden Access to Project. |  -  |
|**404** | Project, Prompt Version, or Link not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

