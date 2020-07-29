/**
 * Created Date: 2020/7/24
 * Author: fgh
 * Description: 路由配置生成路由的文档信息
 */
'use strict';
const swaggerJson = require('./swaggerJson');
const parseJoi = require('./parseJoi');

module.exports = options => {
  // 基础信息
  const apiDefine = {
    tags: Array.isArray(options.tags) ? options.tags : [ options.tags ],
    description: options.description,
  };

  // 输出schema
  if (options.response) {
    apiDefine.responses = {
      200: {
        schema: parseJoi(options.response),
      },
    };
  }

  // path参数
  const pathParams = [];
  for (const param of options.path.matchAll(/\/:([^/]+)/g)) {
    pathParams.push(param[1]);
  }
  apiDefine.parameters = [];
  if (pathParams.length) {
    apiDefine.parameters = pathParams.map(param => ({
      name: param,
      in: 'path',
    }));
  }

  // if (options.input) {
  //   const isGet = options.method.toLowerCase() === 'get';
  //   const schema = parseJoi(options.input);
  //   if (!isGet) {
  //     apiDefine.parameters.push({
  //       name: 'body',
  //       in: 'body',
  //       schema,
  //     });
  //   } else {
  //     apiDefine.parameters = apiDefine.parameters.concat(makeQueryParam(schema));
  //   }
  // }

  // body参数
  if (options.body) {
    apiDefine.parameters.push({
      name: 'body',
      in: 'body',
      schema: parseJoi(options.body),
    });
  }

  // query参数
  if (options.query) {
    const schema = parseJoi(options.query);
    apiDefine.parameters = apiDefine.parameters.concat(makeQueryParam(schema));
  }

  swaggerJson.addApi(options.path, options.method, apiDefine);
};

function makeQueryParam(schema) {
  const result = [];
  const requiredKeys = schema.required || [];
  for (const [ key, v ] of Object.entries(schema.properties)) {
    result.push({
      ...v,
      name: key,
      in: 'query',
      required: requiredKeys.includes(key),
    });
  }
  return result;
}
