# MarketplaceApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**marketplaceControllerGetPublishedAssets**](#marketplacecontrollergetpublishedassets) | **GET** /api/marketplace/assets | Get published assets from the marketplace for the current tenant|
|[**marketplaceControllerGetPublishedPrompts**](#marketplacecontrollergetpublishedprompts) | **GET** /api/marketplace/prompts | Get published prompts from the marketplace for the current tenant|

# **marketplaceControllerGetPublishedAssets**
> marketplaceControllerGetPublishedAssets()


### Example

```typescript
import {
    MarketplaceApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MarketplaceApi(configuration);

let sortOrder: 'asc' | 'desc'; //Sort order (optional) (default to undefined)
let sortBy: 'createdAt' | 'name'; //Sort by field (optional) (default to undefined)
let limit: number; //Items per page (optional) (default to undefined)
let page: number; //Page number for pagination (optional) (default to undefined)
let search: string; //Search term for asset key (optional) (default to undefined)

const { status, data } = await apiInstance.marketplaceControllerGetPublishedAssets(
    sortOrder,
    sortBy,
    limit,
    page,
    search
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **sortOrder** | [**&#39;asc&#39; | &#39;desc&#39;**]**Array<&#39;asc&#39; &#124; &#39;desc&#39;>** | Sort order | (optional) defaults to undefined|
| **sortBy** | [**&#39;createdAt&#39; | &#39;name&#39;**]**Array<&#39;createdAt&#39; &#124; &#39;name&#39;>** | Sort by field | (optional) defaults to undefined|
| **limit** | [**number**] | Items per page | (optional) defaults to undefined|
| **page** | [**number**] | Page number for pagination | (optional) defaults to undefined|
| **search** | [**string**] | Search term for asset key | (optional) defaults to undefined|


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
|**200** | List of published assets. |  -  |
|**401** | Unauthorized. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **marketplaceControllerGetPublishedPrompts**
> marketplaceControllerGetPublishedPrompts()


### Example

```typescript
import {
    MarketplaceApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MarketplaceApi(configuration);

let sortOrder: 'asc' | 'desc'; //Sort order (optional) (default to undefined)
let sortBy: 'createdAt' | 'name'; //Sort by field (optional) (default to undefined)
let limit: number; //Items per page (optional) (default to undefined)
let page: number; //Page number for pagination (optional) (default to undefined)
let search: string; //Search term for prompt name or description (optional) (default to undefined)

const { status, data } = await apiInstance.marketplaceControllerGetPublishedPrompts(
    sortOrder,
    sortBy,
    limit,
    page,
    search
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **sortOrder** | [**&#39;asc&#39; | &#39;desc&#39;**]**Array<&#39;asc&#39; &#124; &#39;desc&#39;>** | Sort order | (optional) defaults to undefined|
| **sortBy** | [**&#39;createdAt&#39; | &#39;name&#39;**]**Array<&#39;createdAt&#39; &#124; &#39;name&#39;>** | Sort by field | (optional) defaults to undefined|
| **limit** | [**number**] | Items per page | (optional) defaults to undefined|
| **page** | [**number**] | Page number for pagination | (optional) defaults to undefined|
| **search** | [**string**] | Search term for prompt name or description | (optional) defaults to undefined|


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
|**200** | List of published prompts. |  -  |
|**401** | Unauthorized. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

