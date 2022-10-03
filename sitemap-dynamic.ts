import { mkdirSync, writeFileSync } from 'fs'
import { Readable } from 'stream'
import { dirname } from 'path'
import { SitemapStream, streamToPromise } from 'sitemap'
import { defineNuxtModule, createResolver } from '@nuxt/kit'

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
        (data) => data.toString()
      )
    }

    function createSitemapFile(sitemap, filepath) {
      const dirPath = dirname(filepath)
      mkdirSync(dirPath, { recursive: true })
      writeFileSync(filepath, sitemap)
    }

    const resolver = createResolver(import.meta.url)
    const filePath = resolver.resolve(
      nuxt.options.srcDir,
      'node_modules/.cache/.sitemap/sitemap.xml'
    )

    nuxt.options.nitro.publicAssets = nuxt.options.nitro.publicAssets || []
    nuxt.options.nitro.publicAssets.push({
      baseURL: '/',
      dir: dirname(filePath),
    })

    nuxt.hook('nitro:build:before', (nitro) => {
      const paths = []
      nitro.hooks.hook('prerender:route', (route) => {
        // Exclude paths which contain /api/_content, _payload.js and the standard 200.html entry point
        // None of these should be in the sitemap.xml file
        if (!route.route.includes('/api/_content') && !route.route.includes('_payload.js') && !route.route.includes('200.html')) {
          paths.push({ path: route.route })
        }
      })
      nitro.hooks.hook('close', async () => {
        const sitemap = await generateSitemap(paths)
        createSitemapFile(sitemap, filePath)
        // Added output to confirm that the sitemap has been created at the end of the build process
        console.log('Sitemap created')
      })
    })
  },
})
