# MarketplaceApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**marketplaceControllerGetPublishedAssets**](#marketplacecontrollergetpublishedassets) | **GET** /api/marketplace/assets | Get published assets|
|[**marketplaceControllerGetPublishedPrompts**](#marketplacecontrollergetpublishedprompts) | **GET** /api/marketplace/prompts | Get published prompts|

# **marketplaceControllerGetPublishedAssets**
> marketplaceControllerGetPublishedAssets()

Retrieves a paginated list of published assets for the current tenant. Results can be filtered, sorted and searched.

### Example

```typescript
import {
    MarketplaceApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MarketplaceApi(configuration);

let search: string; //Search term to filter assets by name or description (optional) (default to undefined)
let page: number; //Page number for pagination (starts at 1) (optional) (default to 1)
let limit: number; //Number of items per page (optional) (default to 10)
let sortBy: string; //Field to sort by (e.g. name, createdAt) (optional) (default to 'createdAt')
let sortOrder: 'ASC' | 'DESC'; //Sort order direction (optional) (default to undefined)
let languageCode: string; //Language code to filter assets (e.g., en-US, es-ES) (optional) (default to undefined)

const { status, data } = await apiInstance.marketplaceControllerGetPublishedAssets(
    search,
    page,
    limit,
    sortBy,
    sortOrder,
    languageCode
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **search** | [**string**] | Search term to filter assets by name or description | (optional) defaults to undefined|
| **page** | [**number**] | Page number for pagination (starts at 1) | (optional) defaults to 1|
| **limit** | [**number**] | Number of items per page | (optional) defaults to 10|
| **sortBy** | [**string**] | Field to sort by (e.g. name, createdAt) | (optional) defaults to 'createdAt'|
| **sortOrder** | [**&#39;ASC&#39; | &#39;DESC&#39;**]**Array<&#39;ASC&#39; &#124; &#39;DESC&#39;>** | Sort order direction | (optional) defaults to undefined|
| **languageCode** | [**string**] | Language code to filter assets (e.g., en-US, es-ES) | (optional) defaults to undefined|


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
|**200** | List of published assets retrieved successfully |  -  |
|**400** | Invalid query parameters - Check the provided values |  -  |
|**401** | Unauthorized - Invalid or expired token |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **marketplaceControllerGetPublishedPrompts**
> marketplaceControllerGetPublishedPrompts()

Retrieves a paginated list of published prompts for the current tenant. Results can be filtered, sorted and searched.

### Example

```typescript
import {
    MarketplaceApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MarketplaceApi(configuration);

let search: string; //Search term to filter prompts by name or description (optional) (default to undefined)
let page: number; //Page number for pagination (starts at 1) (optional) (default to 1)
let limit: number; //Number of items per page (optional) (default to 10)
let sortBy: string; //Field to sort by (e.g. name, createdAt) (optional) (default to 'createdAt')
let sortOrder: 'ASC' | 'DESC'; //Sort order direction (optional) (default to undefined)
let languageCode: string; //Language code to filter prompts (e.g., en-US, es-ES) (optional) (default to undefined)

const { status, data } = await apiInstance.marketplaceControllerGetPublishedPrompts(
    search,
    page,
    limit,
    sortBy,
    sortOrder,
    languageCode
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **search** | [**string**] | Search term to filter prompts by name or description | (optional) defaults to undefined|
| **page** | [**number**] | Page number for pagination (starts at 1) | (optional) defaults to 1|
| **limit** | [**number**] | Number of items per page | (optional) defaults to 10|
| **sortBy** | [**string**] | Field to sort by (e.g. name, createdAt) | (optional) defaults to 'createdAt'|
| **sortOrder** | [**&#39;ASC&#39; | &#39;DESC&#39;**]**Array<&#39;ASC&#39; &#124; &#39;DESC&#39;>** | Sort order direction | (optional) defaults to undefined|
| **languageCode** | [**string**] | Language code to filter prompts (e.g., en-US, es-ES) | (optional) defaults to undefined|


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
|**200** | List of published prompts retrieved successfully |  -  |
|**400** | Invalid query parameters - Check the provided values |  -  |
|**401** | Unauthorized - Invalid or expired token |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

