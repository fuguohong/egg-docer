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

## route
插件会自动加载 app/routes下的文件，使用`app.route(options)`定义路由,

```js
  /**
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
```

### route示例
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

  app.route({
    tags,
    method: 'del',
    path: prefix + '/:id',
    description: '删除指定用户',
    response: userSchema,
    handler: controller.user.destroy,
  });
};
```

## namespace
`app.namespace(nsOptions)`返回一个namespace对象，可以指定一组路由使用共同的标签，前缀和中间件
namespace对象拥有一个和`app.route`相同签名的`route`方法
```js
/**
* @param {object} options nsOptions
* @param {string} options.prefix 前缀
* @param {string|Array<string>} options.tags 接口标签
* @param {function|Array<function>} [options.middlewares] 中间就方法或方法数组
* @return {Namespace} namespace对象
*/
```

### namespace示例
```js
// app/routes/book.js
module.exports = app => {
  const { controller } = app;
  const ns = app.namespace({
    prefix: '/api/1/books',
    tags: 'books',
    middlewares: (ctx, next) => {
      ctx.set('x-use-middlewares', 'true');
      console.log('book middleware called');
      next();
    },
  });

  const bookSchema = Joi.object({
    id: Joi.number().integer(),
    title: Joi.string().max(32).description('名称'),
    authorName: Joi.string().max(32).description('作者名称'),
    authorId: Joi.number().description('作者id'),
    summary: Joi.string().max(255).description('简介'),
  });

  ns.route({
    path: '/',
    method: 'post',
    description: '创建图书',
    body: bookSchema,
    response: bookSchema,
    handler: controller.book.create,
  });

  ns.route({
    path: '/:id',
    method: 'get',
    description: '获取指定图书信息',
    response: bookSchema,
    handler: controller.book.show,
  });


  ns.route({
    path: '/:id',
    method: 'delete',
    description: '删除图书',
    response: bookSchema,
    handler: controller.book.show,
  });

  ns.route({
    path: '/:id',
    method: 'patch',
    description: '更新图书信息',
    body: bookSchema,
    response: bookSchema,
    handler: controller.book.update,
  });
};
```

## context
`context.routeOptions`指向定义路由时输入的参数
```js
app.route({
    tags: 'users',
    path: '/api/1/users',
    method: 'post',
    description: '创建用户',
    body: userSchema,
    response: userSchema,
    handler: ctx=>{
      console.log(ctx.routeOptions.tags) // users
      console.log(ctx.routeOptions.body) // userSchema
    },
  });
```

`context.getParams():{body, query}`用于获取校验返回值，如果autoValidate=fasle则返回原始的输入参数
```js
// get /api/1/users?page=1&size=20
const {query} = ctx.getParams();
console.log(query) // {page:1, size:20}
```

