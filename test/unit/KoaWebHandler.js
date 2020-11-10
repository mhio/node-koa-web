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
      static getMe(){ return true }
    }
    expect(TestWeb.routeConfig()).to.containSubset([])
    const first = TestWeb.routeConfig()[0]
    expect(first).to.containSubset([ 'get', '/me' ]) 
    expect(first[2]).to.be.a('function') // can't test functions in arrays in subset
  })

})
