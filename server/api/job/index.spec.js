'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var jobCtrlStub = {
  index: 'jobCtrl.index',
  show: 'jobCtrl.show',
  create: 'jobCtrl.create',
  update: 'jobCtrl.update',
  destroy: 'jobCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var jobIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './job.controller': jobCtrlStub
});

describe('Job API Router:', function() {

  it('should return an express router instance', function() {
    jobIndex.should.equal(routerStub);
  });

  describe('GET /api/jobs', function() {

    it('should route to job.controller.index', function() {
      routerStub.get
        .withArgs('/', 'jobCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/jobs/:id', function() {

    it('should route to job.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'jobCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/jobs', function() {

    it('should route to job.controller.create', function() {
      routerStub.post
        .withArgs('/', 'jobCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/jobs/:id', function() {

    it('should route to job.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'jobCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/jobs/:id', function() {

    it('should route to job.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'jobCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/jobs/:id', function() {

    it('should route to job.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'jobCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
