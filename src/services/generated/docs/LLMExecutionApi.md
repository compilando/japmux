# LLMExecutionApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**llmExecutionControllerExecuteLlm**](#llmexecutioncontrollerexecutellm) | **POST** /api/llm-execution/execute | Executes a pre-assembled prompt using a specified AI Model via LangChain|

# **llmExecutionControllerExecuteLlm**
> any llmExecutionControllerExecuteLlm(executeLlmDto)


### Example

```typescript
import {
    LLMExecutionApi,
    Configuration,
    ExecuteLlmDto
} from './api';

const configuration = new Configuration();
const apiInstance = new LLMExecutionApi(configuration);

let executeLlmDto: ExecuteLlmDto; //

const { status, data } = await apiInstance.llmExecutionControllerExecuteLlm(
    executeLlmDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **executeLlmDto** | **ExecuteLlmDto**|  | |


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
|**200** | LLM execution successful |  -  |
|**201** |  |  -  |
|**400** | Invalid request body or unsupported provider. |  -  |
|**401** | Unauthorized. |  -  |
|**404** | AI Model not found. |  -  |
|**500** | Internal server error (API Key config, LLM call failed, etc.). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

