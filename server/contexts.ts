import * as trpcNext from '@trpc/server/adapters/next'
import type { inferAsyncReturnType } from '@trpc/server'


export const trpcContext = async (ctx: trpcNext.CreateNextContextOptions) => {
  return {
    req: ctx.req,
    res: ctx.res,
  }
}

export type Context = inferAsyncReturnType<typeof trpcContext>
