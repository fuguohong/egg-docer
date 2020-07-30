/**
 * Created Date: 2020/7/24
 * Author: fgh
 * Description:
 */
'use strict';
const path = require('path');

module.exports = app => {
  require('./lib/route')(app);
  require('./lib/namespace')(app);
  require('./lib/registUI')(app);
  // 自动加载app/routes下的文件
  const loadRouter = app.loader.loadRouter;
  app.loader.loadRouter = function() {
    new app.loader.FileLoader({
      directory: path.join(app.baseDir, 'app/routes'),
      target: {},
      inject: app,
      call: true,
    }).load();
    loadRouter.call(app.loader);
  };
};
