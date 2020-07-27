/**
 * Created Date: 2020/7/24
 * Author: fgh
 * Description:
 */
'use strict';

class SwaggerJson {
  constructor() {
    this.json = {
      swagger: '2.0',
      paths: {},
    };
  }

  addApi(path, method, apiDefine) {
    method = method.toLowerCase();
    path = path.replace(/:([^/]+)/, '{$1}');
    if (!this.json.paths.hasOwnProperty(path)) {
      this.json.paths[path] = {};
    }
    if (method === 'del') {
      method = 'delete';
    }
    this.json.paths[path][method] = apiDefine;
  }

  setInfo(info) {
    this.json.info = info;
  }

  getJson() {
    return this.json;
  }
}

module.exports = new SwaggerJson();

