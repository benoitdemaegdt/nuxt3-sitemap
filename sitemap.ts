import { mkdirSync, writeFileSync } from 'fs'
import { Readable } from 'stream'
import { join, dirname } from 'path'
import { SitemapStream, streamToPromise } from 'sitemap'
import { defineNuxtModule } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'sitemap',
    version: '0.0.1',
    configKey: 'sitemap',
    compatibility: { nuxt: '^3.0.0' },
  },
  defaults: {
    hostname: 'http://localhost:3000',
  },
  async setup(options, nuxt) {

    async function generateSitemap(routes) {
      const sitemapRoutes = routes.map((route) => route.path)
      
      // https://github.com/ekalinin/sitemap.js#generate-a-one-time-sitemap-from-a-list-of-urls
      const stream = new SitemapStream({ hostname: options.hostname })
      return streamToPromise(Readable.from(sitemapRoutes).pipe(stream)).then(
        data => data.toString()
      )
    }

    function createSitemapFile(sitemap, filepath) { 
      const dirPath = dirname(filepath)
      mkdirSync(dirPath, { recursive: true })
      writeFileSync(filepath, sitemap)
    }

    if (!nuxt.options.dev) {
      let routes

      nuxt.hook('pages:extend', async pages => {
        routes = pages
      })

      nuxt.hook('nitro:generate', async ctx => {
        const sitemap = await generateSitemap(routes)
        const filepath = join(ctx.output.publicDir, 'sitemap.xml')
        return createSitemapFile(sitemap, filepath)
      })
    }
  },
})
