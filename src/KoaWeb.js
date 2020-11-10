const http = require('http')
const http2 = require('http2')

const Koa = require('koa')
const koaRouter = require('@koa/router')
const bodyParser = require('koa-bodyparser')

const { Exception } = require('@mhio/exception')
const {
  KoaWebHandle,
} = require('@mhio/koa-web-handle')

const debug = require('debug')('mhio:koa-web:KoaWeb')

class KoaWebException extends Exception {}

/** 
  Handle API requests and errors in Koa apps in a standard way. 
*/
class KoaWeb {

  /**
   * Setup an array of routes
   * @param {object} app            - Koa app
   * @param {object} router         - @koa/router instance
   * @param {array} routes_config    - Array of KoaWebHandle route config objects
   * @returns {object} Koa-Router
   */
  static setupRoutes(routes_config, opts = {}){
    if (!routes_config || !routes_config.length) {
      throw new KoaWebException('Setup requires an array of route configs')
    }
    const router = opts.router || new koaRouter()
    const app = opts.app

    for (const route_config of routes_config){
      debug('Adding route', route_config)
      this.setupRoute(router, route_config)
    }

    if (app) {
      debug('Adding router to provided app')
      app.use(router.routes()).use(router.allowedMethods())
    }
    return router
  }

  /**
   * Setup a single route
   * @param {object}    router                           - @koa/router instance
   * @param {object}    route_config                     - route config object
   * @param {string}    route_config.method              - HTTP method
   * @param {string}    route_config.path                - HTTP Path
   * @param {string}    route_config.template            - Template name
   * @param {function}  route_config.fn                  - Handler function
   * @param {object}    route_config.handler_object      - Object with handler function
   * @param {string}    route_config.handler_function    - Method name to call in handler object
   * @returns {object}  Koa-Router
   */
  static setupRoute(router, route_config = {}) {
    if (!router) throw new KoaWebException('Setup route requires a @koa/router')
    const { method, path, routes, fn, handler_object, handler_function } = this.parseRouteConfig(route_config)
    if (!path) throw new KoaWebException('Setup route requires route path')
    if (routes) {
      const sub_router = this.setupRoutes(routes)
      router.use(path, sub_router.routes()).use(sub_router.allowedMethods())
      return sub_router
    }
    if (!method) throw new KoaWebException('Setup route requires a route method')
    if (!fn && (!handler_object || !handler_function)) {
      throw new KoaWebException('Setup route requires a route `handler_*` or `fn`')
    }
    if (fn && (handler_object || handler_function)) {
      throw new KoaWebException('Setup route requires either `fn` or `handler_*`')
    }
    if (fn && typeof fn !== 'function') {
      throw new KoaWebException('Setup route requires `fn` to be a function')
    }
    if (!fn && !handler_object[handler_function]) {
      const name = (handler_object.name) ? handler_object.name : 'object'
      throw new KoaWebException(`Setup route handler \`${name}[${handler_function}]\` should exist`)
    }
    if (!fn && !handler_object[handler_function].bind) {
      const name = (handler_object.name) ? handler_object.name : 'object'
      throw new KoaWebException(`Setup route handler \`${name}[${handler_function}]\` should be a function`)
    }
    const handleFn = (fn)
      ? KoaWebHandle.response(fn)
      : KoaWebHandle.response(handler_object[handler_function].bind(handler_object))
    router[method](path, handleFn)
    return router
  }


  /**
   * Convert incoming config into required `KoaWeb` objects 
   * `{ method, path, handler, template }`
   * `[ method, path, fn, template ]`
   */
  static parseRouteConfig(route_config){
    // []
    if (Array.isArray(route_config)){
      const method = route_config[0]
      const path = route_config[1]
      const handler = route_config[2]
      const template = route_config[3]
      return { method, path, fn: handler, template }
    }
    // Things like RAML or OpenAPI would go in here. 
    // Not sure how you would link functions to config, probably a class generator
    
    // Object is passed straight through
    return route_config
  }

  static setupApp(opts = {}){
    const routes_config = opts.routes_config
    const app = opts.app || new Koa()
    const logger = opts.logger
    const router = (routes_config)
      ? this.setupRoutes(routes_config)
      : new koaRouter()
    app.use(KoaWebHandle.errors({ logger }))
    app.use(KoaWebHandle.logging({ logger }))
    app.use(KoaWebHandle.tracking())
    app.use(bodyParser({ enableTypes: ['urlencoded'], strict: true }))
    app.use(router.routes()).use(router.allowedMethods())
    app.use(KoaWebHandle.notFound())
    return { app, router }
  }

  static pinoLikeConsoleLogger(){
    return {
      fatal: console.error,
      error: console.error,
      warn: console.log,
      info: console.info,
      debug: console.debug
    }
  }

  constructor(opts = {}){
    const routes = opts.routes
    const logger = opts.logger || this.constructor.pinoLikeConsoleLogger()
    const app = opts.app
    const { app: api_app, router } = this.constructor.setupApp({ routes_config: routes, logger, app })
    this.routes = routes
    this.app = api_app
    this.router = router
    this.logger = logger
  }

  /**
   * Setup a http server to listen for the app
   * @param {string|number} address   - Node http server listen address 
   * @returns {Promise<http.Server>}
   */
  listen(address){
    return new Promise(ok => {
      this.srv = http.createServer(this.app.callback())
      this.srv.listen(address, ()=> ok(this.srv))
    })
  }
  /**
   * Setup a http2 server to listen for the app
   * @param {string|number} address 
   * @returns {Promise<http2.Server>}
   */
  listen2(address){
    return new Promise(ok => {
      // this.srv2 = http2.createServer({}, this.app.callback())
      this.srv2 = http2.createSecureServer({}, this.app.callback())
      this.srv2.listen(address, ()=> ok(this.srv2))
    })
  }

}

module.exports = {
  KoaWeb,
  KoaWebException,
  // Dependencies
  KoaWebHandle,
}
