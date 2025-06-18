# DashboardApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**dashboardControllerGetActivity**](#dashboardcontrollergetactivity) | **GET** /api/dashboard/activity | Get activity|
|[**dashboardControllerGetRecentActivity**](#dashboardcontrollergetrecentactivity) | **GET** /api/dashboard/recent-activity | Get recent activity|
|[**dashboardControllerGetStats**](#dashboardcontrollergetstats) | **GET** /api/dashboard/stats | Get dashboard statistics|

# **dashboardControllerGetActivity**
> Array<RecentActivityDto> dashboardControllerGetActivity()


### Example

```typescript
import {
    DashboardApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DashboardApi(configuration);

let limit: number; // (optional) (default to undefined)
let offset: number; // (optional) (default to undefined)
let userId: string; // (optional) (default to undefined)
let projectId: string; // (optional) (default to undefined)
let entityType: 'PROMPT' | 'PROMPT_VERSION' | 'PROMPT_TRANSLATION' | 'PROMPT_ASSET' | 'PROMPT_ASSET_VERSION' | 'ASSET_TRANSLATION' | 'PROJECT' | 'ENVIRONMENT' | 'AI_MODEL' | 'TAG' | 'REGION' | 'CULTURAL_DATA' | 'RAG_DOCUMENT'; // (optional) (default to undefined)
let action: 'CREATE' | 'UPDATE' | 'DELETE' | 'PUBLISH' | 'UNPUBLISH' | 'APPROVE' | 'REJECT'; // (optional) (default to undefined)

const { status, data } = await apiInstance.dashboardControllerGetActivity(
    limit,
    offset,
    userId,
    projectId,
    entityType,
    action
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **limit** | [**number**] |  | (optional) defaults to undefined|
| **offset** | [**number**] |  | (optional) defaults to undefined|
| **userId** | [**string**] |  | (optional) defaults to undefined|
| **projectId** | [**string**] |  | (optional) defaults to undefined|
| **entityType** | [**&#39;PROMPT&#39; | &#39;PROMPT_VERSION&#39; | &#39;PROMPT_TRANSLATION&#39; | &#39;PROMPT_ASSET&#39; | &#39;PROMPT_ASSET_VERSION&#39; | &#39;ASSET_TRANSLATION&#39; | &#39;PROJECT&#39; | &#39;ENVIRONMENT&#39; | &#39;AI_MODEL&#39; | &#39;TAG&#39; | &#39;REGION&#39; | &#39;CULTURAL_DATA&#39; | &#39;RAG_DOCUMENT&#39;**]**Array<&#39;PROMPT&#39; &#124; &#39;PROMPT_VERSION&#39; &#124; &#39;PROMPT_TRANSLATION&#39; &#124; &#39;PROMPT_ASSET&#39; &#124; &#39;PROMPT_ASSET_VERSION&#39; &#124; &#39;ASSET_TRANSLATION&#39; &#124; &#39;PROJECT&#39; &#124; &#39;ENVIRONMENT&#39; &#124; &#39;AI_MODEL&#39; &#124; &#39;TAG&#39; &#124; &#39;REGION&#39; &#124; &#39;CULTURAL_DATA&#39; &#124; &#39;RAG_DOCUMENT&#39;>** |  | (optional) defaults to undefined|
| **action** | [**&#39;CREATE&#39; | &#39;UPDATE&#39; | &#39;DELETE&#39; | &#39;PUBLISH&#39; | &#39;UNPUBLISH&#39; | &#39;APPROVE&#39; | &#39;REJECT&#39;**]**Array<&#39;CREATE&#39; &#124; &#39;UPDATE&#39; &#124; &#39;DELETE&#39; &#124; &#39;PUBLISH&#39; &#124; &#39;UNPUBLISH&#39; &#124; &#39;APPROVE&#39; &#124; &#39;REJECT&#39;>** |  | (optional) defaults to undefined|


### Return type

**Array<RecentActivityDto>**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Activity retrieved successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **dashboardControllerGetRecentActivity**
> Array<RecentActivityDto> dashboardControllerGetRecentActivity()


### Example

```typescript
import {
    DashboardApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DashboardApi(configuration);

let limit: number; // (optional) (default to undefined)
let offset: number; // (optional) (default to undefined)
let userId: string; // (optional) (default to undefined)
let projectId: string; // (optional) (default to undefined)
let entityType: 'PROMPT' | 'PROMPT_VERSION' | 'PROMPT_TRANSLATION' | 'PROMPT_ASSET' | 'PROMPT_ASSET_VERSION' | 'ASSET_TRANSLATION' | 'PROJECT' | 'ENVIRONMENT' | 'AI_MODEL' | 'TAG' | 'REGION' | 'CULTURAL_DATA' | 'RAG_DOCUMENT'; // (optional) (default to undefined)
let action: 'CREATE' | 'UPDATE' | 'DELETE' | 'PUBLISH' | 'UNPUBLISH' | 'APPROVE' | 'REJECT'; // (optional) (default to undefined)

const { status, data } = await apiInstance.dashboardControllerGetRecentActivity(
    limit,
    offset,
    userId,
    projectId,
    entityType,
    action
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **limit** | [**number**] |  | (optional) defaults to undefined|
| **offset** | [**number**] |  | (optional) defaults to undefined|
| **userId** | [**string**] |  | (optional) defaults to undefined|
| **projectId** | [**string**] |  | (optional) defaults to undefined|
| **entityType** | [**&#39;PROMPT&#39; | &#39;PROMPT_VERSION&#39; | &#39;PROMPT_TRANSLATION&#39; | &#39;PROMPT_ASSET&#39; | &#39;PROMPT_ASSET_VERSION&#39; | &#39;ASSET_TRANSLATION&#39; | &#39;PROJECT&#39; | &#39;ENVIRONMENT&#39; | &#39;AI_MODEL&#39; | &#39;TAG&#39; | &#39;REGION&#39; | &#39;CULTURAL_DATA&#39; | &#39;RAG_DOCUMENT&#39;**]**Array<&#39;PROMPT&#39; &#124; &#39;PROMPT_VERSION&#39; &#124; &#39;PROMPT_TRANSLATION&#39; &#124; &#39;PROMPT_ASSET&#39; &#124; &#39;PROMPT_ASSET_VERSION&#39; &#124; &#39;ASSET_TRANSLATION&#39; &#124; &#39;PROJECT&#39; &#124; &#39;ENVIRONMENT&#39; &#124; &#39;AI_MODEL&#39; &#124; &#39;TAG&#39; &#124; &#39;REGION&#39; &#124; &#39;CULTURAL_DATA&#39; &#124; &#39;RAG_DOCUMENT&#39;>** |  | (optional) defaults to undefined|
| **action** | [**&#39;CREATE&#39; | &#39;UPDATE&#39; | &#39;DELETE&#39; | &#39;PUBLISH&#39; | &#39;UNPUBLISH&#39; | &#39;APPROVE&#39; | &#39;REJECT&#39;**]**Array<&#39;CREATE&#39; &#124; &#39;UPDATE&#39; &#124; &#39;DELETE&#39; &#124; &#39;PUBLISH&#39; &#124; &#39;UNPUBLISH&#39; &#124; &#39;APPROVE&#39; &#124; &#39;REJECT&#39;>** |  | (optional) defaults to undefined|


### Return type

**Array<RecentActivityDto>**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Recent activity retrieved successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **dashboardControllerGetStats**
> DashboardStatsDto dashboardControllerGetStats()


### Example

```typescript
import {
    DashboardApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DashboardApi(configuration);

let projectId: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.dashboardControllerGetStats(
    projectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **projectId** | [**string**] |  | (optional) defaults to undefined|


### Return type

**DashboardStatsDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Statistics retrieved successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

