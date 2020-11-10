/* global expect */

const {
  KoaWeb, KoaWebHandler, KoaWebException,
  KoaWebHandle,
} = require('../../')

describe('test::built::module', function(){

  it('should load the KoaWeb', function(){
    expect( KoaWeb, 'KoaWeb module' ).to.be.ok
  })
  it('should load the KoaWebHandler', function(){
    expect( KoaWebHandler, 'KoaWebHandler module' ).to.be.ok
  })
  it('should creatr a KoaWebHandler route config', function(){
    class Testa extends KoaWebHandler {
      static async getOk(){ return true }
    }
    expect( Testa.routeConfig() ).to.be.an('array')
  })
  it('should load KoaWebException', function(){
    expect( KoaWebException, 'KoaWebEsception module' ).to.be.ok
  })

  it('should load KoaWebHandle', function(){
    expect( KoaWebHandle, 'KoaWebHandle module' ).to.be.ok
  })
})
