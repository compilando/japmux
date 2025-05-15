# PromptAssetVersionsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**promptAssetVersionControllerCreate**](#promptassetversioncontrollercreate) | **POST** /api/projects/{projectId}/prompts/{promptId}/assets/{assetKey}/versions | Create a new version for a specific prompt asset|

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

