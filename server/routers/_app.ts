import { z } from 'zod'
import { procedure, router } from '../trpc'

export const appRouter = router({
  ping: procedure.query(() => {
    return 'Pong!'
  }),
  e621: procedure.input(z.string().optional()).query(async ({ input }) => {
    const formatted_tags = input?.replace(/ /g, '+') ?? ''
    const url = `https://e621.net/posts.json?limit=1&login=${process.env.E621_LOGIN}&api_key=${process.env.E621_API_KEY}&tags=canine+-cub+order:random+-female+score:>100+${formatted_tags}`
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'trpc-nextjs-e621 (by kalka)',
      },
    })
    const json = await response.json()
    return json
  }),
})

export type AppRouter = typeof appRouter
