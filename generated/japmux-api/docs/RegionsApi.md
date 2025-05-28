# RegionsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**regionControllerCreate**](#regioncontrollercreate) | **POST** /api/projects/{projectId}/regions | Create new region|
|[**regionControllerFindAll**](#regioncontrollerfindall) | **GET** /api/projects/{projectId}/regions | Get all regions|
|[**regionControllerFindOne**](#regioncontrollerfindone) | **GET** /api/projects/{projectId}/regions/{langCode} | Get region by language code|
|[**regionControllerRemove**](#regioncontrollerremove) | **DELETE** /api/projects/{projectId}/regions/{langCode} | Delete region|
|[**regionControllerUpdate**](#regioncontrollerupdate) | **PATCH** /api/projects/{projectId}/regions/{langCode} | Update region|

# **regionControllerCreate**
> RegionDto regionControllerCreate(createRegionDto)

Creates a new region for the current tenant. Accessible by global admins or tenant admins.

### Example

```typescript
import {
    RegionsApi,
    Configuration,
    CreateRegionDto
} from './api';

const configuration = new Configuration();
const apiInstance = new RegionsApi(configuration);

let projectId: string; //ID of the project (default to undefined)
let createRegionDto: CreateRegionDto; //

const { status, data } = await apiInstance.regionControllerCreate(
    projectId,
    createRegionDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createRegionDto** | **CreateRegionDto**|  | |
| **projectId** | [**string**] | ID of the project | defaults to undefined|


### Return type

**RegionDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Region successfully created |  -  |
|**400** | Invalid input data - Check the request body format |  -  |
|**401** | Unauthorized - Invalid or expired token |  -  |
|**403** | Forbidden - Insufficient permissions to create regions |  -  |
|**409** | Region already exists - A region with this language code already exists for this tenant |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **regionControllerFindAll**
> Array<RegionDto> regionControllerFindAll()

Retrieves a list of all regions for the current tenant. Results are cached for 1 hour.

### Example

```typescript
import {
    RegionsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RegionsApi(configuration);

let projectId: string; //ID of the project (default to undefined)

const { status, data } = await apiInstance.regionControllerFindAll(
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] | ID of the project | defaults to undefined|


### Return type

**Array<RegionDto>**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | List of regions retrieved successfully |  -  |
|**401** | Unauthorized - Invalid or expired token |  -  |
|**404** | Project not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **regionControllerFindOne**
> RegionDto regionControllerFindOne()

Retrieves a specific region by its language code (e.g., en-US, es-ES). Results are cached for 1 hour.

### Example

```typescript
import {
    RegionsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RegionsApi(configuration);

let langCode: string; //Language code of the region (e.g., en-US, es-ES) (default to undefined)
let projectId: string; //ID of the project (default to undefined)

const { status, data } = await apiInstance.regionControllerFindOne(
    langCode,
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **langCode** | [**string**] | Language code of the region (e.g., en-US, es-ES) | defaults to undefined|
| **projectId** | [**string**] | ID of the project | defaults to undefined|


### Return type

**RegionDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Region found successfully |  -  |
|**401** | Unauthorized - Invalid or expired token |  -  |
|**404** | Region not found - The specified language code does not exist for this tenant |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **regionControllerRemove**
> regionControllerRemove()

Deletes a region by its language code. Accessible by global admins or tenant admins.

### Example

```typescript
import {
    RegionsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RegionsApi(configuration);

let langCode: string; //Language code of the region to delete (e.g., en-US, es-ES) (default to undefined)
let projectId: string; //ID of the project (default to undefined)

const { status, data } = await apiInstance.regionControllerRemove(
    langCode,
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **langCode** | [**string**] | Language code of the region to delete (e.g., en-US, es-ES) | defaults to undefined|
| **projectId** | [**string**] | ID of the project | defaults to undefined|


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
|**204** | Region deleted successfully |  -  |
|**401** | Unauthorized - Invalid or expired token |  -  |
|**403** | Forbidden - Insufficient permissions to delete regions |  -  |
|**404** | Region not found - The specified language code does not exist for this tenant |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **regionControllerUpdate**
> RegionDto regionControllerUpdate(updateRegionDto)

Updates an existing region\'s information. Accessible by global admins or tenant admins.

### Example

```typescript
import {
    RegionsApi,
    Configuration,
    UpdateRegionDto
} from './api';

const configuration = new Configuration();
const apiInstance = new RegionsApi(configuration);

let langCode: string; //Language code of the region to update (e.g., en-US, es-ES) (default to undefined)
let projectId: string; //ID of the project (default to undefined)
let updateRegionDto: UpdateRegionDto; //

const { status, data } = await apiInstance.regionControllerUpdate(
    langCode,
    projectId,
    updateRegionDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateRegionDto** | **UpdateRegionDto**|  | |
| **langCode** | [**string**] | Language code of the region to update (e.g., en-US, es-ES) | defaults to undefined|
| **projectId** | [**string**] | ID of the project | defaults to undefined|


### Return type

**RegionDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Region updated successfully |  -  |
|**400** | Invalid input data - Check the request body format |  -  |
|**401** | Unauthorized - Invalid or expired token |  -  |
|**403** | Forbidden - Insufficient permissions to update regions |  -  |
|**404** | Region not found - The specified language code does not exist for this tenant |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

