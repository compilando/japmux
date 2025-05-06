# ProjectsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**projectControllerCreate**](#projectcontrollercreate) | **POST** /api/projects | Create a new project|
|[**projectControllerFindAll**](#projectcontrollerfindall) | **GET** /api/projects | Get all projects|
|[**projectControllerFindMine**](#projectcontrollerfindmine) | **GET** /api/projects/mine | Get projects accessible by the current user|
|[**projectControllerFindOne**](#projectcontrollerfindone) | **GET** /api/projects/{id} | Get a project by ID|
|[**projectControllerRemove**](#projectcontrollerremove) | **DELETE** /api/projects/{id} | Delete a project by ID|
|[**projectControllerUpdate**](#projectcontrollerupdate) | **PATCH** /api/projects/{id} | Update a project by ID|

# **projectControllerCreate**
> CreateProjectDto projectControllerCreate(createProjectDto)


### Example

```typescript
import {
    ProjectsApi,
    Configuration,
    CreateProjectDto
} from './api';

const configuration = new Configuration();
const apiInstance = new ProjectsApi(configuration);

let createProjectDto: CreateProjectDto; //

const { status, data } = await apiInstance.projectControllerCreate(
    createProjectDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createProjectDto** | **CreateProjectDto**|  | |


### Return type

**CreateProjectDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | The project has been successfully created. |  -  |
|**400** | Bad Request. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectControllerFindAll**
> Array<CreateProjectDto> projectControllerFindAll()


### Example

```typescript
import {
    ProjectsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProjectsApi(configuration);

const { status, data } = await apiInstance.projectControllerFindAll();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<CreateProjectDto>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | List of all projects. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectControllerFindMine**
> Array<CreateProjectDto> projectControllerFindMine()


### Example

```typescript
import {
    ProjectsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProjectsApi(configuration);

const { status, data } = await apiInstance.projectControllerFindMine();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<CreateProjectDto>**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | List of user projects. |  -  |
|**401** | Unauthorized. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectControllerFindOne**
> CreateProjectDto projectControllerFindOne()


### Example

```typescript
import {
    ProjectsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProjectsApi(configuration);

let id: string; //Project CUID (default to undefined)

const { status, data } = await apiInstance.projectControllerFindOne(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Project CUID | defaults to undefined|


### Return type

**CreateProjectDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The found project record |  -  |
|**404** | Project not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectControllerRemove**
> CreateProjectDto projectControllerRemove()


### Example

```typescript
import {
    ProjectsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProjectsApi(configuration);

let id: string; //Project CUID (default to undefined)

const { status, data } = await apiInstance.projectControllerRemove(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Project CUID | defaults to undefined|


### Return type

**CreateProjectDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The project has been successfully deleted. |  -  |
|**404** | Project not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectControllerUpdate**
> CreateProjectDto projectControllerUpdate(updateProjectDto)


### Example

```typescript
import {
    ProjectsApi,
    Configuration,
    UpdateProjectDto
} from './api';

const configuration = new Configuration();
const apiInstance = new ProjectsApi(configuration);

let id: string; //Project CUID (default to undefined)
let updateProjectDto: UpdateProjectDto; //

const { status, data } = await apiInstance.projectControllerUpdate(
    id,
    updateProjectDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateProjectDto** | **UpdateProjectDto**|  | |
| **id** | [**string**] | Project CUID | defaults to undefined|


### Return type

**CreateProjectDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The project has been successfully updated. |  -  |
|**400** | Bad Request. |  -  |
|**404** | Project not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

