# RawExecutionApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**rawExecutionControllerExecuteRawText**](#rawexecutioncontrollerexecuterawtext) | **POST** /api/execute-raw | Executes raw text using a specified System Prompt and AI Model ID.|

# **rawExecutionControllerExecuteRawText**
> object rawExecutionControllerExecuteRawText(executeRawDto)


### Example

```typescript
import {
    RawExecutionApi,
    Configuration,
    ExecuteRawDto
} from './api';

const configuration = new Configuration();
const apiInstance = new RawExecutionApi(configuration);

let executeRawDto: ExecuteRawDto; //

const { status, data } = await apiInstance.rawExecutionControllerExecuteRawText(
    executeRawDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **executeRawDto** | **ExecuteRawDto**|  | |


### Return type

**object**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Execution successful, response from AI model. |  -  |
|**400** | Invalid input data or unsupported provider. |  -  |
|**404** | SystemPrompt or AIModel not found. |  -  |
|**500** | Internal server error (API Key config, LLM execution failed). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

