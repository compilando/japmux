# CreatePromptBackupRequestDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**deletionReason** | **string** | Razón opcional para el borrado | [optional] [default to undefined]
**includeExecutionLogs** | **boolean** | Incluir logs de ejecución en el backup (puede ser pesado) | [optional] [default to false]
**executionLogsLimit** | **number** | Límite de logs de ejecución a incluir | [optional] [default to 50]

## Example

```typescript
import { CreatePromptBackupRequestDto } from './api';

const instance: CreatePromptBackupRequestDto = {
    deletionReason,
    includeExecutionLogs,
    executionLogsLimit,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
