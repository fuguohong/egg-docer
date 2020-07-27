/**
 * Created Date: 2020/7/24
 * Author: fgh
 * Description: 注册ui
 */
'use strict';

module.exports = app => {
  const { config } = app;
  if (!config.docer.enableUI) {
    return;
  }

  const staticCache = require('koa-static-cache');
  const pathUtil = require('path');
  const getIndexContent = require('./viewIndex');
  const swaggerJson = require('./swaggerJson');

  let { prefix } = config.docer;
  if (!prefix) {
    throw new Error('docer.prefix should be given');
  }
  if (prefix.endsWith('/')) {
    prefix = prefix.slice(0, -1);
  }

  swaggerJson.setInfo({
    title: config.name,
    description: config.docer.description,
    version: config.pkg.version,
  });

  app.get(`${prefix}/swagger.json`, ctx => {
    ctx.set('content-type', 'application/json');
    ctx.body = JSON.stringify(swaggerJson.getJson());
  });

  app.get(prefix, ctx => {
    ctx.set('content-type', 'text/html; charset=utf-8');
    ctx.body = getIndexContent(app.config);
  });

  app.use(staticCache(pathUtil.join(__dirname, '../view'), { prefix }));
};
