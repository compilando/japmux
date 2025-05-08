# CulturalDataApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**culturalDataControllerCreate**](#culturaldatacontrollercreate) | **POST** /api/projects/{projectId}/cultural-data | Creates new cultural data within a project|
|[**culturalDataControllerFindAll**](#culturaldatacontrollerfindall) | **GET** /api/projects/{projectId}/cultural-data | Gets all cultural data for a project|
|[**culturalDataControllerFindOne**](#culturaldatacontrollerfindone) | **GET** /api/projects/{projectId}/cultural-data/{culturalDataId} | Gets cultural data by ID within a project|
|[**culturalDataControllerRemove**](#culturaldatacontrollerremove) | **DELETE** /api/projects/{projectId}/cultural-data/{culturalDataId} | Deletes cultural data by ID within a project|
|[**culturalDataControllerUpdate**](#culturaldatacontrollerupdate) | **PATCH** /api/projects/{projectId}/cultural-data/{culturalDataId} | Updates cultural data by ID within a project|

# **culturalDataControllerCreate**
> CulturalDataResponse culturalDataControllerCreate(createCulturalDataDto)


### Example

```typescript
import {
    CulturalDataApi,
    Configuration,
    CreateCulturalDataDto
} from './api';

const configuration = new Configuration();
const apiInstance = new CulturalDataApi(configuration);

let projectId: string; //Project ID (default to undefined)
let createCulturalDataDto: CreateCulturalDataDto; //

const { status, data } = await apiInstance.culturalDataControllerCreate(
    projectId,
    createCulturalDataDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createCulturalDataDto** | **CreateCulturalDataDto**|  | |
| **projectId** | [**string**] | Project ID | defaults to undefined|


### Return type

**CulturalDataResponse**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Cultural data created. |  -  |
|**400** | Invalid data. |  -  |
|**404** | Project or referenced Region not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **culturalDataControllerFindAll**
> Array<CulturalDataResponse> culturalDataControllerFindAll()


### Example

```typescript
import {
    CulturalDataApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CulturalDataApi(configuration);

let projectId: string; //Project ID (default to undefined)

const { status, data } = await apiInstance.culturalDataControllerFindAll(
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] | Project ID | defaults to undefined|


### Return type

**Array<CulturalDataResponse>**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | List of cultural data. |  -  |
|**404** | Project not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **culturalDataControllerFindOne**
> CulturalDataResponse culturalDataControllerFindOne()


### Example

```typescript
import {
    CulturalDataApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CulturalDataApi(configuration);

let culturalDataId: string; //Key of the cultural data (e.g., direct-and-formal) (default to undefined)
let projectId: string; //Project ID (default to undefined)

const { status, data } = await apiInstance.culturalDataControllerFindOne(
    culturalDataId,
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **culturalDataId** | [**string**] | Key of the cultural data (e.g., direct-and-formal) | defaults to undefined|
| **projectId** | [**string**] | Project ID | defaults to undefined|


### Return type

**CulturalDataResponse**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Cultural data found. |  -  |
|**404** | Project or Cultural data not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **culturalDataControllerRemove**
> culturalDataControllerRemove()


### Example

```typescript
import {
    CulturalDataApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CulturalDataApi(configuration);

let culturalDataId: string; //Key of the cultural data to delete (e.g., direct-and-formal) (default to undefined)
let projectId: string; //Project ID (default to undefined)

const { status, data } = await apiInstance.culturalDataControllerRemove(
    culturalDataId,
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **culturalDataId** | [**string**] | Key of the cultural data to delete (e.g., direct-and-formal) | defaults to undefined|
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
|**200** | Cultural data deleted. |  -  |
|**404** | Project or Cultural data not found. |  -  |
|**409** | Conflict on delete (referenced by other entities). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **culturalDataControllerUpdate**
> CulturalDataResponse culturalDataControllerUpdate(updateCulturalDataDto)


### Example

```typescript
import {
    CulturalDataApi,
    Configuration,
    UpdateCulturalDataDto
} from './api';

const configuration = new Configuration();
const apiInstance = new CulturalDataApi(configuration);

let culturalDataId: string; //Key of the cultural data to update (e.g., direct-and-formal) (default to undefined)
let projectId: string; //Project ID (default to undefined)
let updateCulturalDataDto: UpdateCulturalDataDto; //

const { status, data } = await apiInstance.culturalDataControllerUpdate(
    culturalDataId,
    projectId,
    updateCulturalDataDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateCulturalDataDto** | **UpdateCulturalDataDto**|  | |
| **culturalDataId** | [**string**] | Key of the cultural data to update (e.g., direct-and-formal) | defaults to undefined|
| **projectId** | [**string**] | Project ID | defaults to undefined|


### Return type

**CulturalDataResponse**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Cultural data updated. |  -  |
|**400** | Invalid data. |  -  |
|**404** | Project or Cultural data not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

