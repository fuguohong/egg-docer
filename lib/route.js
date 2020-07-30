/**
 * Created Date: 2020/7/24
 * Author: fgh
 * Description:
 */
'use strict';
const assert = require('assert');

module.exports = app => {

  const config = app.config.docer;
  const router = app.router;
  if (config.errorHandler && typeof config.errorHandler !== 'function') {
    throw new Error('errorHandler must be an function');
  }

  /**
   * 定义路由
   * @param {object} options 参数
   * @param {string} options.method required，http verb
   * @param {string} options.path required, 接口路径
   * @param {function|Array<function>} options.handler 处理方法
   * @param {object} [options.query] query参数schema定义,注意query参数不支持对象嵌套
   * @param {object} [options.body] body参数schema定义
   * @param {object} [options.response] 接口输出schema定义，仅用于生成文档，不会对返回值进行校验
   * @param {string|Array<string>} [options.tags] 接口标签
   * @param {string} [options.description] 接口描述
   */
  app.route = options => {
    assert(options.method, 'route options.method is required');
    assert(options.path, 'route options.path is required');
    assert(options.handler, 'route options.handler is required');

    const method = options.method.toLowerCase();
    let handlers = options.handler;
    if (!Array.isArray(handlers)) {
      handlers = [ handlers ];
    }
    handlers.unshift((ctx, next) => {
      ctx.routeOptions = options;
      const input = {
        query: ctx.query,
        body: ctx.request.body,
      };
      ctx.getParams = () => input;
      if (!config.autoValidate) {
        return next();
      }
      if (options.query) {
        const { value, error } = options.query.validate(ctx.query, config.validateOptions);
        if (error) {
          if (config.errorHandler) {
            return config.errorHandler(error, ctx, next);
          }
          throw error;
        }
        input.query = value;
      }
      if (options.body) {
        const { value, error } = options.body.validate(ctx.request.body, config.validateOptions);
        if (error) {
          if (config.errorHandler) {
            return config.errorHandler(error, ctx, next);
          }
          throw error;
        }
        input.body = value;
      }
      return next();
    });

    router[method](options.path, ...handlers);

    if (config.enableUI) {
      require('./generateDoc')(options);
    }
  };
};

