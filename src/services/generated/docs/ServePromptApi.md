# ServePromptApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**servePromptControllerExecutePromptWithLanguage**](#servepromptcontrollerexecutepromptwithlanguage) | **POST** /serve-prompt/execute/{projectId}/{promptName}/{versionTag}/lang/{languageCode} | Assembles and prepares a specific prompt version (specific language) for execution with provided variables|
|[**servePromptControllerExecutePromptWithoutLanguage**](#servepromptcontrollerexecutepromptwithoutlanguage) | **POST** /serve-prompt/execute/{projectId}/{promptName}/{versionTag}/base | Assembles and prepares a specific prompt version (base language) for execution with provided variables|

# **servePromptControllerExecutePromptWithLanguage**
> any servePromptControllerExecutePromptWithLanguage(executePromptBodyDto)


### Example

```typescript
import {
    ServePromptApi,
    Configuration,
    ExecutePromptBodyDto
} from './api';

const configuration = new Configuration();
const apiInstance = new ServePromptApi(configuration);

let projectId: string; //Project ID (default to undefined)
let promptName: string; //The unique name of the prompt within the project (default to undefined)
let versionTag: string; //Specific version tag (e.g., \"v1.2.0\") (default to undefined)
let languageCode: string; //Language code for translation (e.g., \"es\") (default to undefined)
let executePromptBodyDto: ExecutePromptBodyDto; //Input variables for the prompt

const { status, data } = await apiInstance.servePromptControllerExecutePromptWithLanguage(
    projectId,
    promptName,
    versionTag,
    languageCode,
    executePromptBodyDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **executePromptBodyDto** | **ExecutePromptBodyDto**| Input variables for the prompt | |
| **projectId** | [**string**] | Project ID | defaults to undefined|
| **promptName** | [**string**] | The unique name of the prompt within the project | defaults to undefined|
| **versionTag** | [**string**] | Specific version tag (e.g., \&quot;v1.2.0\&quot;) | defaults to undefined|
| **languageCode** | [**string**] | Language code for translation (e.g., \&quot;es\&quot;) | defaults to undefined|


### Return type

**any**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Processed prompt text ready for execution and metadata. |  -  |
|**201** |  |  -  |
|**400** | Invalid parameters or failed template rendering. |  -  |
|**401** | Unauthorized. |  -  |
|**403** | Forbidden Access to Project. |  -  |
|**404** | Project, Prompt, or Version not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **servePromptControllerExecutePromptWithoutLanguage**
> any servePromptControllerExecutePromptWithoutLanguage(executePromptBodyDto)


### Example

```typescript
import {
    ServePromptApi,
    Configuration,
    ExecutePromptBodyDto
} from './api';

const configuration = new Configuration();
const apiInstance = new ServePromptApi(configuration);

let projectId: string; //Project ID (default to undefined)
let promptName: string; //The unique name of the prompt within the project (default to undefined)
let versionTag: string; //Specific version tag (e.g., \"v1.2.0\") (default to undefined)
let executePromptBodyDto: ExecutePromptBodyDto; //Input variables for the prompt

const { status, data } = await apiInstance.servePromptControllerExecutePromptWithoutLanguage(
    projectId,
    promptName,
    versionTag,
    executePromptBodyDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **executePromptBodyDto** | **ExecutePromptBodyDto**| Input variables for the prompt | |
| **projectId** | [**string**] | Project ID | defaults to undefined|
| **promptName** | [**string**] | The unique name of the prompt within the project | defaults to undefined|
| **versionTag** | [**string**] | Specific version tag (e.g., \&quot;v1.2.0\&quot;) | defaults to undefined|


### Return type

**any**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Processed prompt text ready for execution and metadata. |  -  |
|**201** |  |  -  |
|**400** | Invalid parameters or failed template rendering. |  -  |
|**401** | Unauthorized. |  -  |
|**403** | Forbidden Access to Project. |  -  |
|**404** | Project, Prompt, or Version not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

