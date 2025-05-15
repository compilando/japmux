# AssetTranslationsProjectPromptAssetVersionTranslationApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**assetTranslationControllerCreate**](#assettranslationcontrollercreate) | **POST** /api/projects/{projectId}/prompts/{promptId}/assets/{assetKey}/versions/{versionTag}/translations | Create a translation for a specific asset version|
|[**assetTranslationControllerFindAll**](#assettranslationcontrollerfindall) | **GET** /api/projects/{projectId}/prompts/{promptId}/assets/{assetKey}/versions/{versionTag}/translations | Get all translations for a specific asset version|
|[**assetTranslationControllerFindOneByLanguage**](#assettranslationcontrollerfindonebylanguage) | **GET** /api/projects/{projectId}/prompts/{promptId}/assets/{assetKey}/versions/{versionTag}/translations/{languageCode} | Get a specific translation by language code for an asset version|
|[**assetTranslationControllerRemove**](#assettranslationcontrollerremove) | **DELETE** /api/projects/{projectId}/prompts/{promptId}/assets/{assetKey}/versions/{versionTag}/translations/{languageCode} | Delete a specific translation by language code for an asset version|
|[**assetTranslationControllerUpdate**](#assettranslationcontrollerupdate) | **PATCH** /api/projects/{projectId}/prompts/{promptId}/assets/{assetKey}/versions/{versionTag}/translations/{languageCode} | Update a specific translation by language code for an asset version|

# **assetTranslationControllerCreate**
> CreateAssetTranslationDto assetTranslationControllerCreate(createAssetTranslationDto)


### Example

```typescript
import {
    AssetTranslationsProjectPromptAssetVersionTranslationApi,
    Configuration,
    CreateAssetTranslationDto
} from './api';

const configuration = new Configuration();
const apiInstance = new AssetTranslationsProjectPromptAssetVersionTranslationApi(configuration);

let projectId: string; //ID of the Project the Prompt belongs to (default to undefined)
let promptId: string; //ID (slug) of the Prompt (default to undefined)
let assetKey: string; //Key of the PromptAsset (default to undefined)
let versionTag: string; //Tag of the PromptAssetVersion (default to undefined)
let createAssetTranslationDto: CreateAssetTranslationDto; //

const { status, data } = await apiInstance.assetTranslationControllerCreate(
    projectId,
    promptId,
    assetKey,
    versionTag,
    createAssetTranslationDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createAssetTranslationDto** | **CreateAssetTranslationDto**|  | |
| **projectId** | [**string**] | ID of the Project the Prompt belongs to | defaults to undefined|
| **promptId** | [**string**] | ID (slug) of the Prompt | defaults to undefined|
| **assetKey** | [**string**] | Key of the PromptAsset | defaults to undefined|
| **versionTag** | [**string**] | Tag of the PromptAssetVersion | defaults to undefined|


### Return type

**CreateAssetTranslationDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Translation created. |  -  |
|**400** | Invalid data. |  -  |
|**401** | Unauthorized. |  -  |
|**403** | Forbidden Access to Project. |  -  |
|**404** | Project, Asset, or Version not found. |  -  |
|**409** | Translation for this language already exists for this version. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **assetTranslationControllerFindAll**
> Array<CreateAssetTranslationDto> assetTranslationControllerFindAll()


### Example

```typescript
import {
    AssetTranslationsProjectPromptAssetVersionTranslationApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AssetTranslationsProjectPromptAssetVersionTranslationApi(configuration);

let projectId: string; //ID of the Project the Prompt belongs to (default to undefined)
let promptId: string; //ID (slug) of the Prompt (default to undefined)
let assetKey: string; //Key of the PromptAsset (default to undefined)
let versionTag: string; //Tag of the PromptAssetVersion (default to undefined)

const { status, data } = await apiInstance.assetTranslationControllerFindAll(
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
| **versionTag** | [**string**] | Tag of the PromptAssetVersion | defaults to undefined|


### Return type

**Array<CreateAssetTranslationDto>**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | List of translations. |  -  |
|**401** | Unauthorized. |  -  |
|**403** | Forbidden Access to Project. |  -  |
|**404** | Project, Asset, or Version not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **assetTranslationControllerFindOneByLanguage**
> CreateAssetTranslationDto assetTranslationControllerFindOneByLanguage()


### Example

```typescript
import {
    AssetTranslationsProjectPromptAssetVersionTranslationApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AssetTranslationsProjectPromptAssetVersionTranslationApi(configuration);

let projectId: string; //ID of the Project the Prompt belongs to (default to undefined)
let promptId: string; //ID (slug) of the Prompt (default to undefined)
let assetKey: string; //Key of the PromptAsset (default to undefined)
let versionTag: string; //Tag of the PromptAssetVersion (default to undefined)
let languageCode: string; //Language code (e.g., es-ES) (default to undefined)

const { status, data } = await apiInstance.assetTranslationControllerFindOneByLanguage(
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
| **versionTag** | [**string**] | Tag of the PromptAssetVersion | defaults to undefined|
| **languageCode** | [**string**] | Language code (e.g., es-ES) | defaults to undefined|


### Return type

**CreateAssetTranslationDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Translation found. |  -  |
|**401** | Unauthorized. |  -  |
|**403** | Forbidden Access to Project. |  -  |
|**404** | Project, Asset, Version, or Translation not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **assetTranslationControllerRemove**
> assetTranslationControllerRemove()


### Example

```typescript
import {
    AssetTranslationsProjectPromptAssetVersionTranslationApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AssetTranslationsProjectPromptAssetVersionTranslationApi(configuration);

let projectId: string; //ID of the Project the Prompt belongs to (default to undefined)
let promptId: string; //ID (slug) of the Prompt (default to undefined)
let assetKey: string; //Key of the PromptAsset (default to undefined)
let versionTag: string; //Tag of the PromptAssetVersion (default to undefined)
let languageCode: string; //Language code of the translation to delete (default to undefined)

const { status, data } = await apiInstance.assetTranslationControllerRemove(
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
| **versionTag** | [**string**] | Tag of the PromptAssetVersion | defaults to undefined|
| **languageCode** | [**string**] | Language code of the translation to delete | defaults to undefined|


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
|**200** | Translation deleted. |  -  |
|**401** | Unauthorized. |  -  |
|**403** | Forbidden Access to Project. |  -  |
|**404** | Project, Asset, Version, or Translation not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **assetTranslationControllerUpdate**
> CreateAssetTranslationDto assetTranslationControllerUpdate(updateAssetTranslationDto)


### Example

```typescript
import {
    AssetTranslationsProjectPromptAssetVersionTranslationApi,
    Configuration,
    UpdateAssetTranslationDto
} from './api';

const configuration = new Configuration();
const apiInstance = new AssetTranslationsProjectPromptAssetVersionTranslationApi(configuration);

let projectId: string; //ID of the Project the Prompt belongs to (default to undefined)
let promptId: string; //ID (slug) of the Prompt (default to undefined)
let assetKey: string; //Key of the PromptAsset (default to undefined)
let versionTag: string; //Tag of the PromptAssetVersion (default to undefined)
let languageCode: string; //Language code of the translation to update (default to undefined)
let updateAssetTranslationDto: UpdateAssetTranslationDto; //

const { status, data } = await apiInstance.assetTranslationControllerUpdate(
    projectId,
    promptId,
    assetKey,
    versionTag,
    languageCode,
    updateAssetTranslationDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateAssetTranslationDto** | **UpdateAssetTranslationDto**|  | |
| **projectId** | [**string**] | ID of the Project the Prompt belongs to | defaults to undefined|
| **promptId** | [**string**] | ID (slug) of the Prompt | defaults to undefined|
| **assetKey** | [**string**] | Key of the PromptAsset | defaults to undefined|
| **versionTag** | [**string**] | Tag of the PromptAssetVersion | defaults to undefined|
| **languageCode** | [**string**] | Language code of the translation to update | defaults to undefined|


### Return type

**CreateAssetTranslationDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Translation updated. |  -  |
|**400** | Invalid data. |  -  |
|**401** | Unauthorized. |  -  |
|**403** | Forbidden Access to Project. |  -  |
|**404** | Project, Asset, Version, or Translation not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

