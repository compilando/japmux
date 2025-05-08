# RegionsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**regionControllerCreate**](#regioncontrollercreate) | **POST** /api/projects/{projectId}/regions | Creates a new region for a specific project|
|[**regionControllerFindAll**](#regioncontrollerfindall) | **GET** /api/projects/{projectId}/regions | Gets all regions for a specific project|
|[**regionControllerFindOne**](#regioncontrollerfindone) | **GET** /api/projects/{projectId}/regions/{languageCode} | Gets a specific region within a project|
|[**regionControllerRemove**](#regioncontrollerremove) | **DELETE** /api/projects/{projectId}/regions/{languageCode} | Deletes a specific region within a project|
|[**regionControllerUpdate**](#regioncontrollerupdate) | **PATCH** /api/projects/{projectId}/regions/{languageCode} | Updates a specific region within a project|

# **regionControllerCreate**
> CreateRegionDto regionControllerCreate(createRegionDto)


### Example

```typescript
import {
    RegionsApi,
    Configuration,
    CreateRegionDto
} from './api';

const configuration = new Configuration();
const apiInstance = new RegionsApi(configuration);

let projectId: string; //Project ID (default to undefined)
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
| **projectId** | [**string**] | Project ID | defaults to undefined|


### Return type

**CreateRegionDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Region created. |  -  |
|**400** | Invalid data. |  -  |
|**404** | Parent region not found. |  -  |
|**409** | languageCode already exists. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **regionControllerFindAll**
> Array<CreateRegionDto> regionControllerFindAll()


### Example

```typescript
import {
    RegionsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RegionsApi(configuration);

let projectId: string; //Project ID (default to undefined)

const { status, data } = await apiInstance.regionControllerFindAll(
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] | Project ID | defaults to undefined|


### Return type

**Array<CreateRegionDto>**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | List of regions. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **regionControllerFindOne**
> CreateRegionDto regionControllerFindOne()


### Example

```typescript
import {
    RegionsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RegionsApi(configuration);

let languageCode: string; //Language code (ID) of the region (default to undefined)
let projectId: string; //Project ID (default to undefined)

const { status, data } = await apiInstance.regionControllerFindOne(
    languageCode,
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **languageCode** | [**string**] | Language code (ID) of the region | defaults to undefined|
| **projectId** | [**string**] | Project ID | defaults to undefined|


### Return type

**CreateRegionDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Region found. |  -  |
|**404** | Project or Region not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **regionControllerRemove**
> regionControllerRemove()


### Example

```typescript
import {
    RegionsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RegionsApi(configuration);

let languageCode: string; //Language code (ID) of the region to delete (default to undefined)
let projectId: string; //Project ID (default to undefined)

const { status, data } = await apiInstance.regionControllerRemove(
    languageCode,
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **languageCode** | [**string**] | Language code (ID) of the region to delete | defaults to undefined|
| **projectId** | [**string**] | Project ID | defaults to undefined|


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
|**200** | Region deleted. |  -  |
|**404** | Project or Region not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **regionControllerUpdate**
> CreateRegionDto regionControllerUpdate(updateRegionDto)


### Example

```typescript
import {
    RegionsApi,
    Configuration,
    UpdateRegionDto
} from './api';

const configuration = new Configuration();
const apiInstance = new RegionsApi(configuration);

let languageCode: string; //Language code (ID) of the region to update (default to undefined)
let projectId: string; //Project ID (default to undefined)
let updateRegionDto: UpdateRegionDto; //

const { status, data } = await apiInstance.regionControllerUpdate(
    languageCode,
    projectId,
    updateRegionDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateRegionDto** | **UpdateRegionDto**|  | |
| **languageCode** | [**string**] | Language code (ID) of the region to update | defaults to undefined|
| **projectId** | [**string**] | Project ID | defaults to undefined|


### Return type

**CreateRegionDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Region updated. |  -  |
|**400** | Invalid data (languageCode cannot be changed). |  -  |
|**404** | Project or Region not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

