'use strict';

/**
 * egg-docer default config
 * @member Config#docer
 * @property {String} SOME_KEY - some description
 */
module.exports = appInfo => {
  return {
    docer: {
      // 是否加载ui
      enableUI: appInfo.env !== 'prod',
      // 文档url前缀
      prefix: '/docs',
      // 是否校验输入参数
      autoValidate: false,
      // 校验选项
      validateOptions: null,
      // 校验错误处理
      errorHandler: null,
      // 身份认证header key
      securityHeaders: [],
    },
  };
};
