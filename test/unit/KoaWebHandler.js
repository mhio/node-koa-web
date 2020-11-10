/* global expect */
const { KoaWebHandler } = require('../../src/KoaWebHandler')

describe('test::unit::KoaWebHandler', function(){

  it('should load KoaWebHandler', function(){
    expect( KoaWebHandler ).to.be.ok    
  })

  it('should return a routeConfig', function(){
    expect( KoaWebHandler.routeConfig ).to.be.a('function')
  })
  
  it('should return a routeConfig array', function(){
    class TestWeb extends KoaWebHandler {
      static getMeOne(){ return true }
      static template_getTwoPath = 'atemp'
      // static get template_getTwoPath() { return 'atemp' }
      static getTwoPath(){ return true }
      static route_postResponseThree = '/other/path'
      static postResponseThree(){ return true }
    }

    expect(TestWeb.routeConfig()).to.containSubset([])
    const first = TestWeb.routeConfig()[0]
    expect(first).to.containSubset({
      method: 'get',
      path: '/me-one',
    }) 
    expect(first.handler).to.be.a('function') // can't test functions in arrays in subset

    const second = TestWeb.routeConfig()[1]
    expect(second).to.containSubset({
      method: 'get', path: '/two-path', template: 'atemp',
    }) 
    expect(second.handler).to.be.a('function') // can't test functions in arrays in subset

    const third = TestWeb.routeConfig()[2]
    expect(third).to.containSubset({
     method: 'post', path: '/other/path',
    }) 
    expect(third.handler).to.be.a('function') // can't test functions in arrays in subset
  })

})
