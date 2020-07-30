/**
 * Created Date: 2020/7/30
 * Author: fgh
 * Description:
 */
'use strict';
const assert = require('assert');

class Namespace {
  constructor(app, options) {
    this.app = app;
    this.prefix = options.prefix;
    if (this.prefix.endsWith('/')) {
      this.prefix = this.prefix.slice(0, -1);
    }
    this.tags = options.tags;
    this.middlewares = null;
    if (options.middlewares) {
      this.middlewares = Array.isArray(options.middlewares) ? options.middlewares : [ options.middlewares ];
    }
  }

  route(routeOptions) {
    assert(routeOptions.path, 'route options.path is required');
    assert(routeOptions.handler, 'route options.handler is required');
    const opt = { ...routeOptions };
    opt.tags = [ this.tags ];
    if (routeOptions.tags) {
      const tag = Array.isArray(opt.tags) ? opt.tag : [ opt.tag ];
      opt.tags = tag.concat(opt.tags);
    }
    if (!opt.path.startsWith('/')) {
      opt.path = '/' + opt.path;
    }
    opt.path = this.prefix + opt.path;
    if (this.middlewares) {
      opt.handler = Array.isArray(opt.handler) ? opt.handler : [ opt.handler ];
      opt.handler = this.middlewares.concat(opt.handler);
    }
    return this.app.route(opt);
  }
}

module.exports = app => {
  /**
   * 定义namespace
   * @param {object} options nsOptions
   * @param {string} options.prefix 前缀
   * @param {string|Array<string>} options.tags 接口标签
   * @param {function|Array<function>} [options.middlewares] 中间就方法或方法数组
   * @return {Namespace} namespace对象
   */
  app.namespace = options => {
    assert(options.prefix, 'options.prefix is required');
    assert(options.tags, 'options.tags is required');
    assert(typeof options.tags === 'string', 'options.tags accept string type');
    return new Namespace(app, options);
  };
};
