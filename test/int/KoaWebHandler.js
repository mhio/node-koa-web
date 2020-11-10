/* global expect */
const Koa = require('koa')

const { KoaWebHandler } = require('../../src/KoaWebHandler')
const { Taxios } = require('@mhio/taxios')

describe('test::int::KoaWebHandler', function(){

  let app = null
  let request
  let logger

  beforeEach(async function(){
    logger = Taxios.logger()
    app = new Koa()
    request = await Taxios.app(app, logger)
  })

  afterEach(async function(){
    await request.cleanUp()
    request = null
    app = null
    logger = null
  })

  it('should generate a koa response from setupRoutes() router', async function(){
    class MyHandler extends KoaWebHandler {
      
      static template_getThePath = 'whatever'
      static getThePath(ctx) {
        ctx.state = {
          one: 'onestate',
          two: 'twostate',
        }
        return 'goes in `whatever` for GET /the/path'
      }

      static postOveralls() {
         return '<span>some html on /overalls</span>'
      }
    }
    expect(MyHandler.routeConfig()).to.be.an('array').and.have.lengthOf(2)
    // expect()
  })

})
