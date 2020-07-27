/**
 * Created Date: 2020/7/24
 * Author: fgh
 * Description:
 */
'use strict';

const j2s = require('joi-to-swagger');

module.exports = schema => {
  return j2s(schema).swagger;
};
