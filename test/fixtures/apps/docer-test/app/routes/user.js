/**
 * Created Date: 2020/7/27
 * Author: fgh
 * Description: user router
 */
'use strict';

const Joi = require('@hapi/joi');
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { controller } = app;

  const userSchema = Joi.object(
    {
      name: Joi.string().max(15).required()
        .description('用户名'),
      pds: Joi.string().min(6).description('密码'),
      age: Joi.number().description('年龄'),
    }
  );
  const prefix = '/api/1/users';
  const tags = 'users';

  app.route({
    tags,
    path: prefix,
    method: 'post',
    description: '创建用户',
    body: userSchema,
    response: userSchema,
    handler: controller.user.create,
  });

  app.route({
    tags,
    method: 'get',
    path: prefix + '/:id',
    description: '获取指定用户信息',
    response: userSchema,
    handler: controller.user.show,
  });

};
