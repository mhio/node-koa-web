<a name="KoaWeb"></a>

## KoaWeb
<p>Handle API requests and errors in Koa apps in a standard way.</p>

**Kind**: global class  

* [KoaWeb](#KoaWeb)
    * _instance_
        * [.listen(address)](#KoaWeb+listen) ⇒ <code>Promise.&lt;http.Server&gt;</code>
        * [.listen2(address)](#KoaWeb+listen2) ⇒ <code>Promise.&lt;http2.Server&gt;</code>
    * _static_
        * [.setupRoutes(app, router, routes_config)](#KoaWeb.setupRoutes) ⇒ <code>object</code>
        * [.setupRoute(router, route_config)](#KoaWeb.setupRoute) ⇒ <code>object</code>


* * *

<a name="KoaWeb+listen"></a>

### koaWeb.listen(address) ⇒ <code>Promise.&lt;http.Server&gt;</code>
<p>Setup a http server to listen for the app</p>

**Kind**: instance method of [<code>KoaWeb</code>](#KoaWeb)  

| Param | Type | Description |
| --- | --- | --- |
| address | <code>string</code> \| <code>number</code> | <p>Node http server listen address</p> |


* * *

<a name="KoaWeb+listen2"></a>

### koaWeb.listen2(address) ⇒ <code>Promise.&lt;http2.Server&gt;</code>
<p>Setup a http2 server to listen for the app</p>

**Kind**: instance method of [<code>KoaWeb</code>](#KoaWeb)  

| Param | Type |
| --- | --- |
| address | <code>string</code> \| <code>number</code> | 


* * *

<a name="KoaWeb.setupRoutes"></a>

### KoaWeb.setupRoutes(app, router, routes_config) ⇒ <code>object</code>
<p>Setup an array of routes</p>

**Kind**: static method of [<code>KoaWeb</code>](#KoaWeb)  
**Returns**: <code>object</code> - <p>Koa-Router</p>  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | <p>Koa app</p> |
| router | <code>object</code> | <p>@koa/router instance</p> |
| routes_config | <code>array</code> | <p>Array of KoaWebHandle route config objects</p> |


* * *

<a name="KoaWeb.setupRoute"></a>

### KoaWeb.setupRoute(router, route_config) ⇒ <code>object</code>
<p>Setup a single route</p>

**Kind**: static method of [<code>KoaWeb</code>](#KoaWeb)  
**Returns**: <code>object</code> - <p>Koa-Router</p>  

| Param | Type | Description |
| --- | --- | --- |
| router | <code>object</code> | <p>@koa/router instance</p> |
| route_config | <code>object</code> | <p>route config object</p> |
| route_config.method | <code>string</code> | <p>HTTP method</p> |
| route_config.path | <code>string</code> | <p>HTTP Path</p> |
| route_config.template | <code>string</code> | <p>Template name</p> |
| route_config.fn | <code>function</code> | <p>Handler function</p> |
| route_config.handler_object | <code>object</code> | <p>Object with handler function</p> |
| route_config.handler_function | <code>string</code> | <p>Method name to call in handler object</p> |


* * *

