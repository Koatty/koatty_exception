<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [koatty\_exception](./koatty_exception.md) &gt; [HttpStatusCode](./koatty_exception.httpstatuscode.md)

## HttpStatusCode enum

HttpStatusCode

  {<!-- -->number<!-- -->}

<b>Signature:</b>

```typescript
export declare enum HttpStatusCode 
```

## Enumeration Members

|  Member | Value | Description |
|  --- | --- | --- |
|  ACCEPTED | <code>202</code> | The request has been accepted for processing, but the processing has not been completed. The request might or might not be eventually acted upon, and may be disallowed when processing occurs. |
|  ALREADY\_REPORTED | <code>208</code> | The members of a DAV binding have already been enumerated in a preceding part of the (multistatus) response, and are not being included again. |
|  BAD\_GATEWAY | <code>502</code> | The server was acting as a gateway or proxy and received an invalid response from the upstream server. |
|  BAD\_REQUEST | <code>400</code> | The server cannot or will not process the request due to an apparent client error (e.g., malformed request syntax, too large size, invalid request message framing, or deceptive request routing). |
|  CONFLICT | <code>409</code> | Indicates that the request could not be processed because of conflict in the request, such as an edit conflict between multiple simultaneous updates. |
|  CONTINUE | <code>100</code> | The server has received the request headers and the client should proceed to send the request body (in the case of a request for which a body needs to be sent; for example, a POST request). Sending a large request body to a server after a request has been rejected for inappropriate headers would be inefficient. To have a server check the request's headers, a client must send Expect: 100-continue as a header in its initial request and receive a 100 Continue status code in response before sending the body. The response 417 Expectation Failed indicates the request should not be continued. |
|  CREATED | <code>201</code> | The request has been fulfilled, resulting in the creation of a new resource. |
|  EXPECTATION\_FAILED | <code>417</code> | The server cannot meet the requirements of the Expect request-header field. |
|  FAILED\_DEPENDENCY | <code>424</code> | The request failed due to failure of a previous request (e.g., a PROPPATCH). |
|  FORBIDDEN | <code>403</code> | The request was valid, but the server is refusing action. The user might not have the necessary permissions for a resource. |
|  FOUND | <code>302</code> | This is an example of industry practice contradicting the standard. The HTTP/1.0 specification (RFC 1945) required the client to perform a temporary redirect (the original describing phrase was "Moved Temporarily"), but popular browsers implemented 302 with the functionality of a 303 See Other. Therefore, HTTP/1.1 added status codes 303 and 307 to distinguish between the two behaviours. However, some Web applications and frameworks use the 302 status code as if it were the 303. |
|  GATEWAY\_TIMEOUT | <code>504</code> | The server was acting as a gateway or proxy and did not receive a timely response from the upstream server. |
|  GONE | <code>410</code> | Indicates that the resource requested is no longer available and will not be available again. This should be used when a resource has been intentionally removed and the resource should be purged. Upon receiving a 410 status code, the client should not request the resource in the future. Clients such as search engines should remove the resource from their indices. Most use cases do not require clients and search engines to purge the resource, and a "404 Not Found" may be used instead. |
|  HTTP\_VERSION\_NOT\_SUPPORTED | <code>505</code> | The server does not support the HTTP protocol version used in the request |
|  I\_AM\_A\_TEAPOT | <code>418</code> | This code was defined in 1998 as one of the traditional IETF April Fools' jokes, in RFC 2324, Hyper Text Coffee Pot Control Protocol, and is not expected to be implemented by actual HTTP servers. The RFC specifies this code should be returned by teapots requested to brew coffee. This HTTP status is used as an Easter egg in some websites, including Google.com. |
|  IM\_USED | <code>226</code> | The server has fulfilled a request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance. |
|  INSUFFICIENT\_STORAGE | <code>507</code> | The server is unable to store the representation needed to complete the request. |
|  INTERNAL\_SERVER\_ERROR | <code>500</code> | A generic error message, given when an unexpected condition was encountered and no more specific message is suitable. |
|  LENGTH\_REQUIRED | <code>411</code> | The request did not specify the length of its content, which is required by the requested resource. |
|  LOCKED | <code>423</code> | The resource that is being accessed is locked. |
|  LOOP\_DETECTED | <code>508</code> | The server detected an infinite loop while processing the request. |
|  METHOD\_NOT\_ALLOWED | <code>405</code> | A request method is not supported for the requested resource; for example, a GET request on a form that requires data to be presented via POST, or a PUT request on a read-only resource. |
|  MISDIRECTED\_REQUEST | <code>421</code> | The request was directed at a server that is not able to produce a response (for example because a connection reuse). |
|  MOVED\_PERMANENTLY | <code>301</code> | This and all future requests should be directed to the given URI. |
|  MULTI\_STATUS | <code>207</code> | The message body that follows is an XML message and can contain a number of separate response codes, depending on how many sub-requests were made. |
|  MULTIPLE\_CHOICES | <code>300</code> | Indicates multiple options for the resource from which the client may choose (via agent-driven content negotiation). For example, this code could be used to present multiple video format options, to list files with different filename extensions, or to suggest word-sense disambiguation. |
|  NETWORK\_AUTHENTICATION\_REQUIRED | <code>511</code> | The client needs to authenticate to gain network access. Intended for use by intercepting proxies used to control access to the network (e.g., "captive portals" used to require agreement to Terms of Service before granting full Internet access via a Wi-Fi hotspot). |
|  NO\_CONTENT | <code>204</code> | The server successfully processed the request and is not returning any content. |
|  NON\_AUTHORITATIVE\_INFORMATION | <code>203</code> | SINCE HTTP/1.1 The server is a transforming proxy that received a 200 OK from its origin, but is returning a modified version of the origin's response. |
|  NOT\_ACCEPTABLE | <code>406</code> | The requested resource is capable of generating only content not acceptable according to the Accept headers sent in the request. |
|  NOT\_EXTENDED | <code>510</code> | Further extensions to the request are required for the server to fulfill it. |
|  NOT\_FOUND | <code>404</code> | The requested resource could not be found but may be available in the future. Subsequent requests by the client are permissible. |
|  NOT\_IMPLEMENTED | <code>501</code> | The server either does not recognize the request method, or it lacks the ability to fulfill the request. Usually this implies future availability (e.g., a new feature of a web-service API). |
|  NOT\_MODIFIED | <code>304</code> | Indicates that the resource has not been modified since the version specified by the request headers If-Modified-Since or If-None-Match. In such case, there is no need to retransmit the resource since the client still has a previously-downloaded copy. |
|  OK | <code>200</code> | Standard response for successful HTTP requests. The actual response will depend on the request method used. In a GET request, the response will contain an entity corresponding to the requested resource. In a POST request, the response will contain an entity describing or containing the result of the action. |
|  PARTIAL\_CONTENT | <code>206</code> | The server is delivering only part of the resource (byte serving) due to a range header sent by the client. The range header is used by HTTP clients to enable resuming of interrupted downloads, or split a download into multiple simultaneous streams. |
|  PAYLOAD\_TOO\_LARGE | <code>413</code> | The request is larger than the server is willing or able to process. Previously called "Request Entity Too Large". |
|  PAYMENT\_REQUIRED | <code>402</code> | Reserved for future use. The original intention was that this code might be used as part of some form of digital cash or micro payment scheme, but that has not happened, and this code is not usually used. Google Developers API uses this status if a particular developer has exceeded the daily limit on requests. |
|  PERMANENT\_REDIRECT | <code>308</code> | The request and all future requests should be repeated using another URI. 307 and 308 parallel the behaviors of 302 and 301, but do not allow the HTTP method to change. So, for example, submitting a form to a permanently redirected resource may continue smoothly. |
|  PRECONDITION\_FAILED | <code>412</code> | The server does not meet one of the preconditions that the requester put on the request. |
|  PRECONDITION\_REQUIRED | <code>428</code> | The origin server requires the request to be conditional. Intended to prevent "the 'lost update' problem, where a client GETs a resource's state, modifies it, and PUTs it back to the server, when meanwhile a third party has modified the state on the server, leading to a conflict." |
|  PROCESSING | <code>102</code> | A WebDAV request may contain many sub-requests involving file operations, requiring a long time to complete the request. This code indicates that the server has received and is processing the request, but no response is available yet. This prevents the client from timing out and assuming the request was lost. |
|  PROXY\_AUTHENTICATION\_REQUIRED | <code>407</code> | The client must first authenticate itself with the proxy. |
|  RANGE\_NOT\_SATISFIABLE | <code>416</code> | The client has asked for a portion of the file (byte serving), but the server cannot supply that portion. For example, if the client asked for a part of the file that lies beyond the end of the file. Called "Requested Range Not Satisfiable" previously. |
|  REQUEST\_HEADER\_FIELDS\_TOO\_LARGE | <code>431</code> | The server is unwilling to process the request because either an individual header field, or all the header fields collectively, are too large. |
|  REQUEST\_TIMEOUT | <code>408</code> | The server timed out waiting for the request. According to HTTP specifications: "The client did not produce a request within the time that the server was prepared to wait. The client MAY repeat the request without modifications at any later time." |
|  RESET\_CONTENT | <code>205</code> | The server successfully processed the request, but is not returning any content. Unlike a 204 response, this response requires that the requester reset the document view. |
|  SEE\_OTHER | <code>303</code> | SINCE HTTP/1.1 The response to the request can be found under another URI using a GET method. When received in response to a POST (or PUT/DELETE), the client should presume that the server has received the data and should issue a redirect with a separate GET message. |
|  SERVICE\_UNAVAILABLE | <code>503</code> | The server is currently unavailable (because it is overloaded or down for maintenance). Generally, this is a temporary state. |
|  SWITCH\_PROXY | <code>306</code> | No longer used. Originally meant "Subsequent requests should use the specified proxy." |
|  SWITCHING\_PROTOCOLS | <code>101</code> | The requester has asked the server to switch protocols and the server has agreed to do so. |
|  TEMPORARY\_REDIRECT | <code>307</code> | SINCE HTTP/1.1 In this case, the request should be repeated with another URI; however, future requests should still use the original URI. In contrast to how 302 was historically implemented, the request method is not allowed to be changed when reissuing the original request. For example, a POST request should be repeated using another POST request. |
|  TOO\_MANY\_REQUESTS | <code>429</code> | The user has sent too many requests in a given amount of time. Intended for use with rate-limiting schemes. |
|  UNAUTHORIZED | <code>401</code> | Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet been provided. The response must include a WWW-Authenticate header field containing a challenge applicable to the requested resource. See Basic access authentication and Digest access authentication. 401 semantically means "unauthenticated",i.e. the user does not have the necessary credentials. |
|  UNAVAILABLE\_FOR\_LEGAL\_REASONS | <code>451</code> | A server operator has received a legal demand to deny access to a resource or to a set of resources that includes the requested resource. The code 451 was chosen as a reference to the novel Fahrenheit 451. |
|  UNPROCESSABLE\_ENTITY | <code>422</code> | The request was well-formed but was unable to be followed due to semantic errors. |
|  UNSUPPORTED\_MEDIA\_TYPE | <code>415</code> | The request entity has a media type which the server or resource does not support. For example, the client uploads an image as image/svg+xml, but the server requires that images use a different format. |
|  UPGRADE\_REQUIRED | <code>426</code> | The client should switch to a different protocol such as TLS/1.0, given in the Upgrade header field. |
|  URI\_TOO\_LONG | <code>414</code> | The URI provided was too long for the server to process. Often the result of too much data being encoded as a query-string of a GET request, in which case it should be converted to a POST request. Called "Request-URI Too Long" previously. |
|  USE\_PROXY | <code>305</code> | SINCE HTTP/1.1 The requested resource is available only through a proxy, the address for which is provided in the response. Many HTTP clients (such as Mozilla and Internet Explorer) do not correctly handle responses with this status code, primarily for security reasons. |
|  VARIANT\_ALSO\_NEGOTIATES | <code>506</code> | Transparent content negotiation for the request results in a circular reference. |
