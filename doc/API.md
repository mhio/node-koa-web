## Classes

<dl>
<dt><a href="#KoaWeb">KoaWeb</a></dt>
<dd><p>Handle API requests and errors in Koa apps in a standard way.</p></dd>
<dt><a href="#KoaWebHandler">KoaWebHandler</a></dt>
<dd><p>KoaWebHandler (name)</p></dd>
</dl>

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
        * [.parseRouteConfig()](#KoaWeb.parseRouteConfig)


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

<a name="KoaWeb.parseRouteConfig"></a>

### KoaWeb.parseRouteConfig()
<p>Convert incoming config into required <code>KoaWeb</code> objects
<code>{ method, path, handler, template }</code>
<code>[ method, path, fn, template ]</code></p>

**Kind**: static method of [<code>KoaWeb</code>](#KoaWeb)  

* * *

<a name="KoaWebHandler"></a>

## KoaWebHandler
<p>KoaWebHandler (name)</p>

**Kind**: global class  

* [KoaWebHandler](#KoaWebHandler)
    * _instance_
        * [.path_joiner](#KoaWebHandler+path_joiner)
    * _static_
        * [.bindFunction(name)](#KoaWebHandler.bindFunction) ⇒ <code>function</code>
        * [.routeHttpName(function_name)](#KoaWebHandler.routeHttpName)
        * [.routeHttpMethod(function_name)](#KoaWebHandler.routeHttpMethod) ⇒ <code>object</code>
        * [.routeConfig()](#KoaWebHandler.routeConfig) ⇒ <code>Array</code>


* * *

<a name="KoaWebHandler+path_joiner"></a>

### koaWebHandler.path\_joiner
<p>Whether to hyphenate API route paths</p>

**Kind**: instance property of [<code>KoaWebHandler</code>](#KoaWebHandler)  

* * *

<a name="KoaWebHandler.bindFunction"></a>

### KoaWebHandler.bindFunction(name) ⇒ <code>function</code>
<p>Simple <code>bind</code> helper</p>

**Kind**: static method of [<code>KoaWebHandler</code>](#KoaWebHandler)  
**Returns**: <code>function</code> - <ul>
<li>Function bound to <code>this</code> class object</li>
</ul>  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | <p>Function name to bind</p> |


* * *

<a name="KoaWebHandler.routeHttpName"></a>

### KoaWebHandler.routeHttpName(function_name)
<p>Get the second camel case word onwards</p>

**Kind**: static method of [<code>KoaWebHandler</code>](#KoaWebHandler)  

| Param | Type | Description |
| --- | --- | --- |
| function_name | <code>string</code> | <p>Function name to split</p> |


* * *

<a name="KoaWebHandler.routeHttpMethod"></a>

### KoaWebHandler.routeHttpMethod(function_name) ⇒ <code>object</code>
<p>Get the first camel case word as route method and the rest as a route /path string
If a route method has a <code>route_{{Method}}</code> property, that will be used instead.</p>

**Kind**: static method of [<code>KoaWebHandler</code>](#KoaWebHandler)  
**Returns**: <code>object</code> - <ul>
<li></li>
</ul>  

| Param | Type | Description |
| --- | --- | --- |
| function_name | <code>string</code> | <p>Function name to turn into route method/path</p> |


* * *

<a name="KoaWebHandler.routeConfig"></a>

### KoaWebHandler.routeConfig() ⇒ <code>Array</code>
<p>Return the KoaWeb route config array for this handler</p>

**Kind**: static method of [<code>KoaWebHandler</code>](#KoaWebHandler)  
**Returns**: <code>Array</code> - <p>KoaWeb route config array</p>  

* * *

