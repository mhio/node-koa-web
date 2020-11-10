/* global expect */
const Koa = require('koa')


const { KoaWeb } = require('../../src/KoaWeb')
const { Taxios } = require('@mhio/taxios')

describe('test::int::KoaWeb', function(){

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
    let routes = [
      { path: '/ok', method: 'get', fn: ()=> Promise.resolve('aok') }
    ]
    const router = KoaWeb.setupRoutes(routes)
    app.use(router.routes()).use(router.allowedMethods())
    let res = await request.get('/ok')
    expect( res.status ).to.equal(200)
    expect( res.data ).to.equal('aok')
  })

  it('should generate a koa response for a passed in app', async function(){
    let routes = [
      { path: '/ok', method: 'get', fn: ()=> Promise.resolve('ok') }
    ]
    KoaWeb.setupRoutes(routes, { app })
    let res = await request.get('/ok')
    expect( res.status ).to.equal(200)
    expect( res.data ).to.equal('ok')
  })

  it('should generate a koa response for a handler using `this`', async function(){
    const handler = {
      ok: function() { return Promise.resolve(this.value) },
      value: 'okeydokey',
    }
    let routes = [
      { path: '/ok', method: 'get', handler_object: handler, handler_function: 'ok' }
    ]
    KoaWeb.setupRoutes(routes, { app })
    let res = await request.get('/ok')
    expect( res.status ).to.equal(200)
    expect( res.data ).to.equal('okeydokey')
  })

  it('should generate a koa response for sub `routes`', async function(){
    let routes = [
      { path: '/ok', method: 'get', fn: ()=> Promise.resolve('ok1') },
      { path: '/sub', routes: [
        { path: '/ok', method: 'get', fn: ()=> Promise.resolve('ok2') },
      ]},
    ]
    KoaWeb.setupRoutes(routes, { app })
    let res = await request.get('/sub/ok')
    expect( res.status ).to.equal(200)
    expect( res.data ).to.equal('ok2')
    let res_ok = await request.get('/ok')
    expect( res_ok.status ).to.equal(200)
    expect( res_ok.data ).to.equal('ok1')
  })

  it('should create a KoaWeb with no config', function(){
    const api = new KoaWeb()
    expect( api.app ).to.be.ok
    expect( api.router ).to.be.ok
  })

  it('should create a KoaWeb with object config and respond', async function(){
    const routes = [
      { path: '/ok', method: 'get', fn: ()=> Promise.resolve('ok') }
    ]
    new KoaWeb({ routes, app, logger, })
    let res = await request.get('/ok')
    expect( res.status ).to.equal(200)
    expect( res.data ).to.equal('ok')
    expect(logger.logs).to.have.lengthOf(1)
    expect(logger.logs[0]).to.containSubset(['info'])
  })

  it('should create a KoaWeb with multi object config and respond', async function(){
    const routes = [
      { path: '/ok', method: 'get', fn: ()=> Promise.resolve('ok') },
      [ 'get', '/ok2', ()=> Promise.resolve('ok') ],
    ]
    new KoaWeb({ routes, app, logger, })
    let res = await request.get('/ok')
    expect( res.status ).to.equal(200)
    expect( res.data ).to.equal('ok')
    expect(logger.logs).to.have.lengthOf(1)
    expect(logger.logs[0]).to.containSubset(['info'])
    let res2 = await request.get('/ok2')
    expect( res2.status ).to.equal(200)
    expect( res2.data ).to.equal('ok')
  })

  it('should create a KoaWeb with sub router config and respond', async function(){
    const routes = [
      { path: '/ok', method: 'get', fn: ()=> Promise.resolve('ok') },
      { path: '/sub', routes: [
        [ 'get', '/ok2', ()=> Promise.resolve('ok2') ],
      ]},
      [ 'get', '/ok3', ()=> Promise.resolve('ok3') ],
    ]
    new KoaWeb({ routes, app, logger, })
    let res = await request.get('/ok')
    expect( res.status ).to.equal(200)
    expect( res.data ).to.equal('ok')
    expect(logger.logs).to.have.lengthOf(1)
    expect(logger.logs[0]).to.containSubset(['info'])
    let res2 = await request.get('/sub/ok2')
    expect( res2.status ).to.equal(200)
    expect( res2.data ).to.equal('ok2')
    let res3 = await request.get('/ok3')
    expect( res3.status ).to.equal(200)
    expect( res3.data ).to.equal('ok3')
  })

  describe('listens', function(){

    let listens_request

    afterEach('close', async function(){
      await listens_request.close()
    })

    it('should listen on http', async function(){
      const api = new KoaWeb({ routes: [[ 'get', '/ok', async ()=>'ok' ]], logger })
      const srv = await api.listen()
      listens_request = Taxios.server(srv)
      let res = await listens_request.get('/ok')
      expect(logger.logs_errors).to.eql([])
      expect( res.data ).to.equal('ok')
    })

    xit('should listen on http2', async function(){
      const api = new KoaWeb({ routes: [[ 'get', '/ok', async()=>'ok' ]], app, logger, })
      const srv2 = await api.listen2()
      listens_request = Taxios.server2(srv2)
      let res = await listens_request.get('/ok')
      expect(logger.logs_errors).to.eql([])
      expect( res.data ).to.equal('ok')
    })

  })

})
