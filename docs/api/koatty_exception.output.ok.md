<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [koatty\_exception](./koatty_exception.md) &gt; [Output](./koatty_exception.output.md) &gt; [ok](./koatty_exception.output.ok.md)

## Output.ok() method

Response to normalize json format content for success

**Signature:**

```typescript
static ok(msg: string | JsonResult, data?: any, code?: number): JsonResult;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  msg | string \| [JsonResult](./koatty_exception.jsonresult.md) | 待处理的message消息 |
|  data | any | _(Optional)_ 待处理的数据 |
|  code | number | _(Optional)_ 错误码，默认0 |

**Returns:**

[JsonResult](./koatty_exception.jsonresult.md)

{<!-- -->\*<!-- -->}  BaseController

