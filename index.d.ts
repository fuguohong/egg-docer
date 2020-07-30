import { Context } from 'egg'

interface HandlerFunc{
  (ctx: Context, next?: { (): void }): void
}

interface RouteOptions{
  method: string
  path: string
  handler: HandlerFunc | Array<HandlerFunc>
  query?: any,
  body?: any,
  response?: any,
  tags?: string | Array<string>
  description?: string
}

interface NsOptions{
  prefix: string
  tags: string
  middlewares?: HandlerFunc | Array<HandlerFunc>
}

interface Namespace{
  route (options: RouteOptions): void
}

declare module 'egg'{
  interface Application{
    route (options: RouteOptions): void;

    namespace (options: NsOptions): Namespace
  }
}
