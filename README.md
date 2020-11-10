@mhio/koa-web
--------------------

A Koa Web module to do all the request heavy lifting, so you just write logic/templates

Errors, logging, and templates are handled, just `return` the data or `throw` the error

Based on [`@mhio/koa-web-handler`](https://github.com/mhio/node-koa-web-handle).

## Install

```
yarn add @mhio/koa-web
npm install @mhio/koa-web
```

## Usage

[API docs](doc/API.md)

```
const {KoaWeb, KoaWebHandler} = require('@mhio/koa-web')

class MyHandler extends KoaWebHandler {
  static templateWhateverThePath(ctx) {
     return 'goes in `whatever` from /the/path'
  }
  static responseOveralls(ctx) {
     return '<span>some html on /overalls</span>'
  }
}

const web = new KoaWeb({ routes: MyHandler.routeConfig() })
web.listen().then(srv => console.log(srv))
```

Or custom config can be injected as an array of `routes`
```
const {KoaWeb} = require('@mhio/koa-web')

class MyHandler {

  static get error_message(){
    return 'Failure'
  }

  static async ok(ctx){
    return {
      ok: true,
      request_id, ctx.state.request_id,
    }
  }

  static async other(){
    return 'other'
  }

  static async error(){
    throw new Error(this.error_message)
  }

}

// Route config for the API
const routes = [
  // Simple function
  [ 'get', '/ok', MyHandler.ok ],

  // Function bound to parent
  [ 'get', '/ok2', MyHandler, 'ok' ],

  // Object setup
  { method: 'post', path: '/other', fn: MyHandler.other },

  // binds `MyHandler` for you
  { method: 'get', path: '/error', handler_object: MyHandler, handler_function: 'error' },
]
const web = new KoaWeb({ routes })
web.listen().then(srv => console.log(srv))
```
