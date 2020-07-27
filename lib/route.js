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
   * @param {object} [options.input] 参数schema定义
   * @param {object} [options.output] 接口输出schema定义，仅用于生成文档，不会对返回值进行校验
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
      if (!config.autoValidate || !options.input) {
        return next();
      }
      let input = ctx.request.body;
      if (method === 'get') {
        input = ctx.query;
      }
      const { value, err } = options.input.validate(input, config.validateOptions);
      if (err) {
        if (config.errorHandler) {
          return config.errorHandler(err, ctx, next);
        }
        throw err;
      }
      ctx.input = value;
      return next();
    });

    router[method](options.path, ...handlers);

    if (config.enableUI) {
      require('./generateDoc')(options);
    }
  };
};

