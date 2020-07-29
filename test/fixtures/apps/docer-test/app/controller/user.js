'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = {
      items: [{
        name: 'aa',
      }, {
        name: 'bb',
      }],
      page: 1,
      pageSize: 10,
    };
  }
  async create() {
    const { ctx } = this;
    const { body } = ctx.getParams();
    ctx.body = body;
  }

  async show() {
    const { ctx } = this;
    ctx.body = {
      id: ctx.params.id,
      name: 'test',
      pds: '******',
      age: 25,
    };
  }

  async update() {
    const { ctx } = this;
    ctx.body = {
      account: 'zz',
      name: 'zz0',
    };
  }

  async destroy() {
    const { ctx } = this;
    ctx.body = 'ok';
  }
}

module.exports = UserController;

