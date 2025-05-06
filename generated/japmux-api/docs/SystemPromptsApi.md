# SystemPromptsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**systemPromptControllerCreate**](#systempromptcontrollercreate) | **POST** /api/system-prompts | Create a new system prompt (Admin Only - conceptually)|
|[**systemPromptControllerFindAll**](#systempromptcontrollerfindall) | **GET** /api/system-prompts | Get all system prompts|
|[**systemPromptControllerFindOne**](#systempromptcontrollerfindone) | **GET** /api/system-prompts/{name} | Get a specific system prompt by name|
|[**systemPromptControllerRemove**](#systempromptcontrollerremove) | **DELETE** /api/system-prompts/{name} | Delete a system prompt (Admin Only - conceptually)|
|[**systemPromptControllerUpdate**](#systempromptcontrollerupdate) | **PATCH** /api/system-prompts/{name} | Update an existing system prompt (Admin Only - conceptually)|

# **systemPromptControllerCreate**
> systemPromptControllerCreate(createSystemPromptDto)


### Example

```typescript
import {
    SystemPromptsApi,
    Configuration,
    CreateSystemPromptDto
} from './api';

const configuration = new Configuration();
const apiInstance = new SystemPromptsApi(configuration);

let createSystemPromptDto: CreateSystemPromptDto; //

const { status, data } = await apiInstance.systemPromptControllerCreate(
    createSystemPromptDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createSystemPromptDto** | **CreateSystemPromptDto**|  | |


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | System prompt created successfully. |  -  |
|**400** | Invalid input data. |  -  |
|**401** | Unauthorized. |  -  |
|**404** | Conflict: Name already exists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **systemPromptControllerFindAll**
> systemPromptControllerFindAll()


### Example

```typescript
import {
    SystemPromptsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SystemPromptsApi(configuration);

const { status, data } = await apiInstance.systemPromptControllerFindAll();
```

### Parameters
This endpoint does not have any parameters.


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
|**200** | List of system prompts. |  -  |
|**401** | Unauthorized. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **systemPromptControllerFindOne**
> systemPromptControllerFindOne()


### Example

```typescript
import {
    SystemPromptsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SystemPromptsApi(configuration);

let name: string; //Unique name of the system prompt (default to undefined)

const { status, data } = await apiInstance.systemPromptControllerFindOne(
    name
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **name** | [**string**] | Unique name of the system prompt | defaults to undefined|


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
|**200** | System prompt details. |  -  |
|**401** | Unauthorized. |  -  |
|**404** | System prompt not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **systemPromptControllerRemove**
> systemPromptControllerRemove()


### Example

```typescript
import {
    SystemPromptsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SystemPromptsApi(configuration);

let name: string; //Unique name of the system prompt to delete (default to undefined)

const { status, data } = await apiInstance.systemPromptControllerRemove(
    name
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **name** | [**string**] | Unique name of the system prompt to delete | defaults to undefined|


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
|**200** | System prompt deleted successfully. |  -  |
|**401** | Unauthorized. |  -  |
|**404** | System prompt not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **systemPromptControllerUpdate**
> systemPromptControllerUpdate(updateSystemPromptDto)


### Example

```typescript
import {
    SystemPromptsApi,
    Configuration,
    UpdateSystemPromptDto
} from './api';

const configuration = new Configuration();
const apiInstance = new SystemPromptsApi(configuration);

let name: string; //Unique name of the system prompt to update (default to undefined)
let updateSystemPromptDto: UpdateSystemPromptDto; //

const { status, data } = await apiInstance.systemPromptControllerUpdate(
    name,
    updateSystemPromptDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateSystemPromptDto** | **UpdateSystemPromptDto**|  | |
| **name** | [**string**] | Unique name of the system prompt to update | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | System prompt updated successfully. |  -  |
|**400** | Invalid input data. |  -  |
|**401** | Unauthorized. |  -  |
|**404** | System prompt not found or conflict with new name. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

