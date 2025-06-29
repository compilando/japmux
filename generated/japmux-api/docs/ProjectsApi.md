# ProjectsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**projectControllerCreate**](#projectcontrollercreate) | **POST** /api/projects | Create new project|
|[**projectControllerFindAll**](#projectcontrollerfindall) | **GET** /api/projects | Get all projects|
|[**projectControllerFindMine**](#projectcontrollerfindmine) | **GET** /api/projects/mine | Get current user projects|
|[**projectControllerFindOne**](#projectcontrollerfindone) | **GET** /api/projects/{id} | Get project by ID|
|[**projectControllerRemove**](#projectcontrollerremove) | **DELETE** /api/projects/{id} | Delete project|
|[**projectControllerUpdate**](#projectcontrollerupdate) | **PATCH** /api/projects/{id} | Update project|

# **projectControllerCreate**
> ProjectDto projectControllerCreate(createProjectDto)

Creates a new project for the current tenant. Accessible by global admins or tenant admins.

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

**ProjectDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Project successfully created |  -  |
|**400** | Invalid input data - Check the request body format |  -  |
|**401** | Unauthorized - Invalid or expired token |  -  |
|**403** | Forbidden - Insufficient permissions to create projects |  -  |
|**409** | Project already exists - A project with this name already exists for this tenant |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectControllerFindAll**
> Array<ProjectDto> projectControllerFindAll()

Retrieves a list of all projects for the current tenant. Results are cached for 1 hour.

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

**Array<ProjectDto>**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | List of projects retrieved successfully |  -  |
|**401** | Unauthorized - Invalid or expired token |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectControllerFindMine**
> Array<CreateProjectDto> projectControllerFindMine()

Returns all projects that the authenticated user has access to

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
|**200** | List of user projects |  -  |
|**401** | Unauthorized - Invalid or expired token |  -  |
|**403** | Access denied - Tenant information not available |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectControllerFindOne**
> ProjectDto projectControllerFindOne()

Retrieves a specific project by its unique ID. Results are cached for 1 hour.

### Example

```typescript
import {
    ProjectsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProjectsApi(configuration);

let id: string; //Unique project identifier (UUID) (default to undefined)

const { status, data } = await apiInstance.projectControllerFindOne(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Unique project identifier (UUID) | defaults to undefined|


### Return type

**ProjectDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Project found successfully |  -  |
|**401** | Unauthorized - Invalid or expired token |  -  |
|**404** | Project not found - The specified ID does not exist for this tenant |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectControllerRemove**
> projectControllerRemove()

Deletes a project by ID.

### Example

```typescript
import {
    ProjectsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProjectsApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.projectControllerRemove(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


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
|**200** |  |  -  |
|**204** | Project deleted successfully |  -  |
|**401** | Unauthorized - Invalid or expired token |  -  |
|**404** | Project not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectControllerUpdate**
> ProjectDto projectControllerUpdate(updateProjectDto)

Updates an existing project by ID.

### Example

```typescript
import {
    ProjectsApi,
    Configuration,
    UpdateProjectDto
} from './api';

const configuration = new Configuration();
const apiInstance = new ProjectsApi(configuration);

let id: string; // (default to undefined)
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
| **id** | [**string**] |  | defaults to undefined|


### Return type

**ProjectDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Project updated successfully |  -  |
|**401** | Unauthorized - Invalid or expired token |  -  |
|**404** | Project not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

