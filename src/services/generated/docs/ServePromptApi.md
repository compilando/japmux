# ServePromptApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**servePromptControllerExecutePrompt**](#servepromptcontrollerexecuteprompt) | **POST** /serve-prompt/execute/{projectId}/{promptName}/{versionTag} | Assembles and prepares a specific prompt version for execution with provided variables|

# **servePromptControllerExecutePrompt**
> any servePromptControllerExecutePrompt(executePromptBodyDto)


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
let languageCode: string; //Optional language code for translation (e.g., \"es\") (optional) (default to undefined)
let environmentName: string; //Optional environment context (currently informational) (optional) (default to undefined)

const { status, data } = await apiInstance.servePromptControllerExecutePrompt(
    projectId,
    promptName,
    versionTag,
    executePromptBodyDto,
    languageCode,
    environmentName
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **executePromptBodyDto** | **ExecutePromptBodyDto**| Input variables for the prompt | |
| **projectId** | [**string**] | Project ID | defaults to undefined|
| **promptName** | [**string**] | The unique name of the prompt within the project | defaults to undefined|
| **versionTag** | [**string**] | Specific version tag (e.g., \&quot;v1.2.0\&quot;) | defaults to undefined|
| **languageCode** | [**string**] | Optional language code for translation (e.g., \&quot;es\&quot;) | (optional) defaults to undefined|
| **environmentName** | [**string**] | Optional environment context (currently informational) | (optional) defaults to undefined|


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

