## 使用场景

手动编写api文档是一件繁琐的工作，目前npm上有许多文档生成工具，但都是基于注释的，
属于半手动半自动，会存在代码可能都改几版了，文档还没更新的问题。
理想状态应该是代码即文档，代码一改文档同步更新。这也是编写本插件的目的。<br/>
它通过定义路由的代码来生成swagger2.0规范的json文件，内嵌swagger ui，
启动项目打开`http://localhost:3000/docs` 即可看到api文档，也可以将swagger json文档导入到其他支持swagger的文档工具来查看或生成前端接口定义

## 安装
```
npm install egg-docer --save
```

## 开启插件

```js
// config/plugin.js
exports.docer = {
  enable: true,
  package: 'egg-docer',
};
```

## 配置
```js
// config/config.default.js
config.docer = {
      // 是否加载ui，false时不会生成swagger json，也不会注册文档路由
      enableUI: appInfo.env !== 'prod',
      // 文档url前缀,生成的swagger json可以通过请求{prefix}/swagger.json获取。
      prefix: '/docs',
      // 是否校验输入参数，
      autoValidate: false,
      // 校验选项，传递给Joi的校验选项
      validateOptions: null,
      // 开启参数校验时，自定义错误处理
      errorHandler: (err, ctx, next)=>{},
      // todo schema类型，目前仅支持Joi
      schemaType: 'joi',
    }
```

## 定义路由
插件会自动加载 app/routes下的文件，使用`app.route(options)`定义路由,
可以从`ctx.options`获取定义路由的配置对象,如果启用了自动校验，可以从`ctx.input`获取校验后的值

## route options
```js
 // TODO 支持query参数，支持错误返回
  /**
   * @param {string} options.method required，http verb
   * @param {string} options.path required, 接口路径
   * @param {function|Array<function>} options.handler 处理方法
   * @param {object} [options.input] 参数schema定义
   * @param {object} [options.output] 接口输出schema定义，仅用于生成文档，不会对返回值进行校验
   * @param {string|Array<string>} [options.tags] 接口标签
   * @param {string} [options.description] 接口描述
   */
```

## 例子
```js
// app/routes/user.js

const Joi = require('@hapi/joi');
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
    input: userSchema,
    output: userSchema,
    handler: controller.user.create,
  });

  app.route({
    tags,
    method: 'get',
    path: prefix + '/:id',
    description: '获取指定用户信息',
    output: userSchema,
    handler: controller.user.show,
  });
};

```



