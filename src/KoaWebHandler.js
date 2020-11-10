import debugr from 'debug'
import _snakecase from 'lodash.snakecase'

const debug = debugr('mhio:koa-api:KoaWebHandler')

/**
 * Makes a bit less sense than the API due to extended options.
 *
 * @class      KoaWebHandler (name)
 */
export class KoaWebHandler {

  static _initialiseClass(){
    /**
     * Whether to hyphenate API route paths
     */
    // this.path_joiner = ''
    this.path_joiner = '-'
  }
  
  /**
   * Simple `bind` helper
   * @param {string} name               - Function name to bind
   * @returns {function}                - Function bound to `this` class object
   */
  static bindFunction(name){
    return this[name].bind(this)
  }
  
  /**
   * Get the second camel case word onwards
   * @param {string} function_name      - Function name to split
   */
  static routeHttpName(function_name, joiner = ''){
    return _snakecase(function_name)
      .split('_')
      .slice(1)
      .join(joiner)
      .toLowerCase()
  }
  
  /**
   * Get the first camel case word as route method and the rest as a route /path string
   * If a route method has a `route_{{Method}}` property, that will be used instead.
   * @param {string} function_name      - Function name to turn into route method/path
   * @returns {object}                  - 
   */
  static routeHttpMethod(function_name){
    const route_name = this[`route_${function_name}`] || this.routeHttpName(function_name, this.path_joiner)
    const template = this[`template_${function_name}`]
    if (function_name.startsWith('get')) {
      return { method: 'get', route_name, template }
    }
    if (function_name.startsWith('post') || function_name.startsWith('create')) {
      return { method: 'post', route_name, template }
    }
    if (function_name.startsWith('delete') || function_name.startsWith('remove')) {
      return { method: 'delete', route_name, template }
    }
    if (function_name.startsWith('patch') || function_name.startsWith('update')) {
      return { method: 'patch', route_name, template }
    }
    if (function_name.startsWith('put') || function_name.startsWith('replace')) {
      return { method: 'put', route_name, template }
    }
    return { skip: true }
  }

  /**
   * Return the KoaWeb route config array for this handler
   * @returns {Array} KoaWeb route config array
   */
  static routeConfig(){
    const config = []
    debug('routeConfig for %s', this.name)
    for (const fn_name of Object.getOwnPropertyNames(this)){
      const { method, route_name, skip, template } = this.routeHttpMethod(fn_name)
      if (skip) {
        // debug('routeConfig skipping', fn_name)
        continue
      }
      debug('routeConfig found [%s]', fn_name, method, route_name, template)
      const route_path = (route_name.startsWith('/')) ? route_name : `/${route_name}`
      config.push({
        method,
        path: route_path,
        handler: this.bindFunction(fn_name),
        template,
      })
      //config.push([route_method, `/${route_name}`, this.bindFunction(fn_name), template_name ])
    }
    return config
  }
  
}
KoaWebHandler._initialiseClass()

export default KoaWebHandler
