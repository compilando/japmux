# PromptTranslationsWithinProjectPromptVersionApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**promptTranslationControllerCreate**](#prompttranslationcontrollercreate) | **POST** /api/projects/{projectId}/prompts/{promptId}/versions/{versionTag}/translations | Create a translation for a specific prompt version within a project|
|[**promptTranslationControllerFindAll**](#prompttranslationcontrollerfindall) | **GET** /api/projects/{projectId}/prompts/{promptId}/versions/{versionTag}/translations | Get all translations for a specific prompt version within a project|
|[**promptTranslationControllerFindOneByLanguage**](#prompttranslationcontrollerfindonebylanguage) | **GET** /api/projects/{projectId}/prompts/{promptId}/versions/{versionTag}/translations/{languageCode} | Get a specific translation by language code for a prompt version. Allows resolving assets.|
|[**promptTranslationControllerRemove**](#prompttranslationcontrollerremove) | **DELETE** /api/projects/{projectId}/prompts/{promptId}/versions/{versionTag}/translations/{languageCode} | Delete a specific translation by language code for a prompt version|
|[**promptTranslationControllerUpdate**](#prompttranslationcontrollerupdate) | **PATCH** /api/projects/{projectId}/prompts/{promptId}/versions/{versionTag}/translations/{languageCode} | Update a specific translation by language code for a prompt version|

# **promptTranslationControllerCreate**
> CreatePromptTranslationDto promptTranslationControllerCreate(createPromptTranslationDto)


### Example

```typescript
import {
    PromptTranslationsWithinProjectPromptVersionApi,
    Configuration,
    CreatePromptTranslationDto
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptTranslationsWithinProjectPromptVersionApi(configuration);

let projectId: string; //Project ID (default to undefined)
let promptId: string; //Prompt CUID (default to undefined)
let versionTag: string; //Version Tag (e.g., v1.0.0) or \"latest\" to get the most recent version (default to undefined)
let createPromptTranslationDto: CreatePromptTranslationDto; //

const { status, data } = await apiInstance.promptTranslationControllerCreate(
    projectId,
    promptId,
    versionTag,
    createPromptTranslationDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createPromptTranslationDto** | **CreatePromptTranslationDto**|  | |
| **projectId** | [**string**] | Project ID | defaults to undefined|
| **promptId** | [**string**] | Prompt CUID | defaults to undefined|
| **versionTag** | [**string**] | Version Tag (e.g., v1.0.0) or \&quot;latest\&quot; to get the most recent version | defaults to undefined|


### Return type

**CreatePromptTranslationDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Translation created. |  -  |
|**400** | Invalid data (e.g., missing languageCode). |  -  |
|**401** | Unauthorized. |  -  |
|**403** | Forbidden Access to Project. |  -  |
|**404** | Project, Prompt, or Version not found. |  -  |
|**409** | Translation for this language already exists for this version. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **promptTranslationControllerFindAll**
> Array<CreatePromptTranslationDto> promptTranslationControllerFindAll()


### Example

```typescript
import {
    PromptTranslationsWithinProjectPromptVersionApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptTranslationsWithinProjectPromptVersionApi(configuration);

let projectId: string; //Project ID (default to undefined)
let promptId: string; //Prompt CUID (default to undefined)
let versionTag: string; //Version Tag (e.g., v1.0.0) or \"latest\" to get the most recent version (default to undefined)

const { status, data } = await apiInstance.promptTranslationControllerFindAll(
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
| **versionTag** | [**string**] | Version Tag (e.g., v1.0.0) or \&quot;latest\&quot; to get the most recent version | defaults to undefined|


### Return type

**Array<CreatePromptTranslationDto>**

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
|**404** | Project, Prompt, or Version not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **promptTranslationControllerFindOneByLanguage**
> CreatePromptTranslationDto promptTranslationControllerFindOneByLanguage()


### Example

```typescript
import {
    PromptTranslationsWithinProjectPromptVersionApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptTranslationsWithinProjectPromptVersionApi(configuration);

let projectId: string; //Project ID (default to undefined)
let promptId: string; //Prompt CUID (default to undefined)
let versionTag: string; //Version Tag (e.g., v1.0.0) or \"latest\" to get the most recent version (default to undefined)
let languageCode: string; //Language code (e.g., es-ES) (default to undefined)
let resolveAssets: boolean; //Whether to resolve asset placeholders. Defaults to false. (optional) (default to undefined)
let environmentId: string; //Environment ID for context. (optional) (default to undefined)
let regionCode: string; //Region code for context (e.g., for asset translations - overrides languageCode for assets if provided). (optional) (default to undefined)
let variables: string; //JSON stringified object of variables for substitution. (optional) (default to undefined)
let processed: boolean; //Whether to return the processed prompt with all references and variables resolved. Defaults to false. (optional) (default to undefined)

const { status, data } = await apiInstance.promptTranslationControllerFindOneByLanguage(
    projectId,
    promptId,
    versionTag,
    languageCode,
    resolveAssets,
    environmentId,
    regionCode,
    variables,
    processed
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] | Project ID | defaults to undefined|
| **promptId** | [**string**] | Prompt CUID | defaults to undefined|
| **versionTag** | [**string**] | Version Tag (e.g., v1.0.0) or \&quot;latest\&quot; to get the most recent version | defaults to undefined|
| **languageCode** | [**string**] | Language code (e.g., es-ES) | defaults to undefined|
| **resolveAssets** | [**boolean**] | Whether to resolve asset placeholders. Defaults to false. | (optional) defaults to undefined|
| **environmentId** | [**string**] | Environment ID for context. | (optional) defaults to undefined|
| **regionCode** | [**string**] | Region code for context (e.g., for asset translations - overrides languageCode for assets if provided). | (optional) defaults to undefined|
| **variables** | [**string**] | JSON stringified object of variables for substitution. | (optional) defaults to undefined|
| **processed** | [**boolean**] | Whether to return the processed prompt with all references and variables resolved. Defaults to false. | (optional) defaults to undefined|


### Return type

**CreatePromptTranslationDto**

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
|**404** | Project, Prompt, Version, or Translation not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **promptTranslationControllerRemove**
> promptTranslationControllerRemove()


### Example

```typescript
import {
    PromptTranslationsWithinProjectPromptVersionApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptTranslationsWithinProjectPromptVersionApi(configuration);

let projectId: string; //Project ID (default to undefined)
let promptId: string; //Prompt CUID (default to undefined)
let versionTag: string; //Version Tag (e.g., v1.0.0) or \"latest\" to get the most recent version (default to undefined)
let languageCode: string; //Language code of the translation to delete (default to undefined)

const { status, data } = await apiInstance.promptTranslationControllerRemove(
    projectId,
    promptId,
    versionTag,
    languageCode
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] | Project ID | defaults to undefined|
| **promptId** | [**string**] | Prompt CUID | defaults to undefined|
| **versionTag** | [**string**] | Version Tag (e.g., v1.0.0) or \&quot;latest\&quot; to get the most recent version | defaults to undefined|
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
|**404** | Project, Prompt, Version, or Translation not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **promptTranslationControllerUpdate**
> CreatePromptTranslationDto promptTranslationControllerUpdate(updatePromptTranslationDto)


### Example

```typescript
import {
    PromptTranslationsWithinProjectPromptVersionApi,
    Configuration,
    UpdatePromptTranslationDto
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptTranslationsWithinProjectPromptVersionApi(configuration);

let projectId: string; //Project ID (default to undefined)
let promptId: string; //Prompt CUID (default to undefined)
let versionTag: string; //Version Tag (e.g., v1.0.0) or \"latest\" to get the most recent version (default to undefined)
let languageCode: string; //Language code of the translation to update (default to undefined)
let updatePromptTranslationDto: UpdatePromptTranslationDto; //

const { status, data } = await apiInstance.promptTranslationControllerUpdate(
    projectId,
    promptId,
    versionTag,
    languageCode,
    updatePromptTranslationDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updatePromptTranslationDto** | **UpdatePromptTranslationDto**|  | |
| **projectId** | [**string**] | Project ID | defaults to undefined|
| **promptId** | [**string**] | Prompt CUID | defaults to undefined|
| **versionTag** | [**string**] | Version Tag (e.g., v1.0.0) or \&quot;latest\&quot; to get the most recent version | defaults to undefined|
| **languageCode** | [**string**] | Language code of the translation to update | defaults to undefined|


### Return type

**CreatePromptTranslationDto**

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
|**404** | Project, Prompt, Version, or Translation not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

