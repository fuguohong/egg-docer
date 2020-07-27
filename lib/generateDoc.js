/**
 * Created Date: 2020/7/24
 * Author: fgh
 * Description:
 */
'use strict';
const swaggerJson = require('./swaggerJson');
const parseJoi = require('./parseJoi');

module.exports = options => {
  const apiDefine = {
    tags: Array.isArray(options.tags) ? options.tags : [ options.tags ],
    description: options.description,
  };
  if (options.output) {
    apiDefine.responses = {
      200: {
        schema: parseJoi(options.output),
      },
    };
  }
  if (options.input) {
    const isGet = options.method.toLowerCase() === 'get';
    const name = isGet ? 'query' : 'body';
    apiDefine.parameters = [{
      name,
      in: 'body',
      schema: parseJoi(options.input),
    }];
  }
  swaggerJson.addApi(options.path, options.method, apiDefine);
};
