# AssetTranslationsWithinProjectAssetVersionApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**assetTranslationControllerCreate**](#assettranslationcontrollercreate) | **POST** /api/projects/{projectId}/assets/{assetKey}/versions/{versionTag}/translations | Create a translation for a specific asset version within a project|
|[**assetTranslationControllerFindAll**](#assettranslationcontrollerfindall) | **GET** /api/projects/{projectId}/assets/{assetKey}/versions/{versionTag}/translations | Get all translations for a specific asset version within a project|
|[**assetTranslationControllerFindOneByLanguage**](#assettranslationcontrollerfindonebylanguage) | **GET** /api/projects/{projectId}/assets/{assetKey}/versions/{versionTag}/translations/{languageCode} | Get a specific translation by language code for an asset version|
|[**assetTranslationControllerRemove**](#assettranslationcontrollerremove) | **DELETE** /api/projects/{projectId}/assets/{assetKey}/versions/{versionTag}/translations/{languageCode} | Delete a specific translation by language code for an asset version|
|[**assetTranslationControllerUpdate**](#assettranslationcontrollerupdate) | **PATCH** /api/projects/{projectId}/assets/{assetKey}/versions/{versionTag}/translations/{languageCode} | Update a specific translation by language code for an asset version|

# **assetTranslationControllerCreate**
> CreateAssetTranslationDto assetTranslationControllerCreate(createAssetTranslationDto)


### Example

```typescript
import {
    AssetTranslationsWithinProjectAssetVersionApi,
    Configuration,
    CreateAssetTranslationDto
} from './api';

const configuration = new Configuration();
const apiInstance = new AssetTranslationsWithinProjectAssetVersionApi(configuration);

let projectId: string; //Project ID (default to undefined)
let assetKey: string; //Asset Key (default to undefined)
let versionTag: string; //Version Tag (default to undefined)
let createAssetTranslationDto: CreateAssetTranslationDto; //

const { status, data } = await apiInstance.assetTranslationControllerCreate(
    projectId,
    assetKey,
    versionTag,
    createAssetTranslationDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createAssetTranslationDto** | **CreateAssetTranslationDto**|  | |
| **projectId** | [**string**] | Project ID | defaults to undefined|
| **assetKey** | [**string**] | Asset Key | defaults to undefined|
| **versionTag** | [**string**] | Version Tag | defaults to undefined|


### Return type

**CreateAssetTranslationDto**

### Authorization

No authorization required

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
    AssetTranslationsWithinProjectAssetVersionApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AssetTranslationsWithinProjectAssetVersionApi(configuration);

let projectId: string; //Project ID (default to undefined)
let assetKey: string; //Asset Key (default to undefined)
let versionTag: string; //Version Tag (default to undefined)

const { status, data } = await apiInstance.assetTranslationControllerFindAll(
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
| **versionTag** | [**string**] | Version Tag | defaults to undefined|


### Return type

**Array<CreateAssetTranslationDto>**

### Authorization

No authorization required

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
    AssetTranslationsWithinProjectAssetVersionApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AssetTranslationsWithinProjectAssetVersionApi(configuration);

let projectId: string; //Project ID (default to undefined)
let assetKey: string; //Asset Key (default to undefined)
let versionTag: string; //Version Tag (default to undefined)
let languageCode: string; //Language code (e.g., es-ES) (default to undefined)

const { status, data } = await apiInstance.assetTranslationControllerFindOneByLanguage(
    projectId,
    assetKey,
    versionTag,
    languageCode
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] | Project ID | defaults to undefined|
| **assetKey** | [**string**] | Asset Key | defaults to undefined|
| **versionTag** | [**string**] | Version Tag | defaults to undefined|
| **languageCode** | [**string**] | Language code (e.g., es-ES) | defaults to undefined|


### Return type

**CreateAssetTranslationDto**

### Authorization

No authorization required

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
    AssetTranslationsWithinProjectAssetVersionApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AssetTranslationsWithinProjectAssetVersionApi(configuration);

let projectId: string; //Project ID (default to undefined)
let assetKey: string; //Asset Key (default to undefined)
let versionTag: string; //Version Tag (default to undefined)
let languageCode: string; //Language code of the translation to delete (default to undefined)

const { status, data } = await apiInstance.assetTranslationControllerRemove(
    projectId,
    assetKey,
    versionTag,
    languageCode
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] | Project ID | defaults to undefined|
| **assetKey** | [**string**] | Asset Key | defaults to undefined|
| **versionTag** | [**string**] | Version Tag | defaults to undefined|
| **languageCode** | [**string**] | Language code of the translation to delete | defaults to undefined|


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
    AssetTranslationsWithinProjectAssetVersionApi,
    Configuration,
    UpdateAssetTranslationDto
} from './api';

const configuration = new Configuration();
const apiInstance = new AssetTranslationsWithinProjectAssetVersionApi(configuration);

let projectId: string; //Project ID (default to undefined)
let assetKey: string; //Asset Key (default to undefined)
let versionTag: string; //Version Tag (default to undefined)
let languageCode: string; //Language code of the translation to update (default to undefined)
let updateAssetTranslationDto: UpdateAssetTranslationDto; //

const { status, data } = await apiInstance.assetTranslationControllerUpdate(
    projectId,
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
| **projectId** | [**string**] | Project ID | defaults to undefined|
| **assetKey** | [**string**] | Asset Key | defaults to undefined|
| **versionTag** | [**string**] | Version Tag | defaults to undefined|
| **languageCode** | [**string**] | Language code of the translation to update | defaults to undefined|


### Return type

**CreateAssetTranslationDto**

### Authorization

No authorization required

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

