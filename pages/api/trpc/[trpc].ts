import * as trpcNext from '@trpc/server/adapters/next'
import { appRouter } from '../../../server/routers/_app'

export default trpcNext.createNextApiHandler({
  router: appRouter,

  createContext: async (ctx) => {
    return {
      req: ctx.req,
      res: ctx.res,
    }
  }

})