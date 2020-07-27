'use strict';

const mock = require('egg-mock');

describe('test/docer.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/docer-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('hi, docer')
      .expect(200);
  });
});
