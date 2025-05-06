# EnvironmentsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**environmentControllerCreate**](#environmentcontrollercreate) | **POST** /api/projects/{projectId}/environments | Creates a new environment for a project|
|[**environmentControllerFindAll**](#environmentcontrollerfindall) | **GET** /api/projects/{projectId}/environments | Gets all environments for a project|
|[**environmentControllerFindByName**](#environmentcontrollerfindbyname) | **GET** /api/projects/{projectId}/environments/by-name/{name} | Gets an environment by its name within a project|
|[**environmentControllerFindOne**](#environmentcontrollerfindone) | **GET** /api/projects/{projectId}/environments/{environmentId} | Gets an environment by its ID within a project|
|[**environmentControllerRemove**](#environmentcontrollerremove) | **DELETE** /api/projects/{projectId}/environments/{environmentId} | Deletes an environment from a project|
|[**environmentControllerUpdate**](#environmentcontrollerupdate) | **PATCH** /api/projects/{projectId}/environments/{environmentId} | Updates an existing environment in a project|

# **environmentControllerCreate**
> CreateEnvironmentDto environmentControllerCreate(createEnvironmentDto)


### Example

```typescript
import {
    EnvironmentsApi,
    Configuration,
    CreateEnvironmentDto
} from './api';

const configuration = new Configuration();
const apiInstance = new EnvironmentsApi(configuration);

let projectId: string; //Project ID (default to undefined)
let createEnvironmentDto: CreateEnvironmentDto; //

const { status, data } = await apiInstance.environmentControllerCreate(
    projectId,
    createEnvironmentDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createEnvironmentDto** | **CreateEnvironmentDto**|  | |
| **projectId** | [**string**] | Project ID | defaults to undefined|


### Return type

**CreateEnvironmentDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Environment created. |  -  |
|**400** | Invalid data. |  -  |
|**404** | Project not found. |  -  |
|**409** | Conflict, an environment with this name already exists in the project. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **environmentControllerFindAll**
> Array<CreateEnvironmentDto> environmentControllerFindAll()


### Example

```typescript
import {
    EnvironmentsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EnvironmentsApi(configuration);

let projectId: string; //Project ID (default to undefined)

const { status, data } = await apiInstance.environmentControllerFindAll(
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] | Project ID | defaults to undefined|


### Return type

**Array<CreateEnvironmentDto>**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | List of environments. |  -  |
|**404** | Project not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **environmentControllerFindByName**
> CreateEnvironmentDto environmentControllerFindByName()


### Example

```typescript
import {
    EnvironmentsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EnvironmentsApi(configuration);

let name: string; //Unique environment name in the project (default to undefined)
let projectId: string; //Project ID (default to undefined)

const { status, data } = await apiInstance.environmentControllerFindByName(
    name,
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **name** | [**string**] | Unique environment name in the project | defaults to undefined|
| **projectId** | [**string**] | Project ID | defaults to undefined|


### Return type

**CreateEnvironmentDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Environment found. |  -  |
|**404** | Project or Environment not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **environmentControllerFindOne**
> CreateEnvironmentDto environmentControllerFindOne()


### Example

```typescript
import {
    EnvironmentsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EnvironmentsApi(configuration);

let environmentId: string; //Unique environment ID (CUID) (default to undefined)
let projectId: string; //Project ID (default to undefined)

const { status, data } = await apiInstance.environmentControllerFindOne(
    environmentId,
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **environmentId** | [**string**] | Unique environment ID (CUID) | defaults to undefined|
| **projectId** | [**string**] | Project ID | defaults to undefined|


### Return type

**CreateEnvironmentDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Environment found. |  -  |
|**404** | Project or Environment not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **environmentControllerRemove**
> CreateEnvironmentDto environmentControllerRemove()


### Example

```typescript
import {
    EnvironmentsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EnvironmentsApi(configuration);

let environmentId: string; //Unique ID of the environment to delete (CUID) (default to undefined)
let projectId: string; //Project ID (default to undefined)

const { status, data } = await apiInstance.environmentControllerRemove(
    environmentId,
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **environmentId** | [**string**] | Unique ID of the environment to delete (CUID) | defaults to undefined|
| **projectId** | [**string**] | Project ID | defaults to undefined|


### Return type

**CreateEnvironmentDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Environment deleted. |  -  |
|**404** | Project or Environment not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **environmentControllerUpdate**
> CreateEnvironmentDto environmentControllerUpdate(updateEnvironmentDto)


### Example

```typescript
import {
    EnvironmentsApi,
    Configuration,
    UpdateEnvironmentDto
} from './api';

const configuration = new Configuration();
const apiInstance = new EnvironmentsApi(configuration);

let environmentId: string; //Unique ID of the environment to update (CUID) (default to undefined)
let projectId: string; //Project ID (default to undefined)
let updateEnvironmentDto: UpdateEnvironmentDto; //

const { status, data } = await apiInstance.environmentControllerUpdate(
    environmentId,
    projectId,
    updateEnvironmentDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateEnvironmentDto** | **UpdateEnvironmentDto**|  | |
| **environmentId** | [**string**] | Unique ID of the environment to update (CUID) | defaults to undefined|
| **projectId** | [**string**] | Project ID | defaults to undefined|


### Return type

**CreateEnvironmentDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Environment updated. |  -  |
|**400** | Invalid data. |  -  |
|**404** | Project or Environment not found. |  -  |
|**409** | Conflict, an environment with the new name already exists in the project. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

