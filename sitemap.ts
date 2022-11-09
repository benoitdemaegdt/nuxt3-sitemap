import { mkdirSync, writeFileSync } from 'fs'
import { Readable } from 'stream'
import { dirname } from 'path'
import { SitemapStream, streamToPromise } from 'sitemap'
import { defineNuxtModule, createResolver } from '@nuxt/kit'


interface IKeyedData {
    [key: string]: string[]
}

interface IDynamicRoute {
    url: string,
    data: IKeyedData
}

interface IRoute {
    path: string
}

export default defineNuxtModule({
  meta: {
    name: 'sitemap',
    version: '0.0.1',
    configKey: 'sitemap',
    compatibility: { nuxt: '^3.0.0-rc.11' },
  },
  defaults: {
      hostname: 'http://localhost:3000',
      dynamicRoutes: [] as IDynamicRoute[],
      manualRoutes: [] as string[],
      verbose: false
  },
  async setup(options, nuxt) {
    let sitemapRoutes: string[]

    function rep(str: string, param: string, val: string) {
        return str
            .replace(`:${param}`, val)
            .replace(`:${param}?`, val)
    }

    async function generateSitemap(routes: IRoute[]) {
        const sitemapRoutesOrig: string[] = routes.map(route => route.path)

        sitemapRoutes = sitemapRoutesOrig.filter(r => !r.includes(':'))
        sitemapRoutes = [...sitemapRoutes, ...options.manualRoutes]

        // TODO: check for dynamicRoute config and generate entries
        // if (options.dynamicRoutes?.length > 0) {
        //     let dynamicRoutes: IDynamicRoute[] = options.dynamicRoutes
        //     for (let r of dynamicRoutes) {
        //         for (let [key1, items1] of Object.entries(r.data)) {
        //             for (let item1 of items1) {
        //                 let tmp = `${r.url}`
        //                 tmp = rep(tmp, key1, item1)
        //                 sitemapRoutes.push(tmp)
        //             }
        //         }
        //     }
        // }

        // dedupe
        sitemapRoutes = [...new Set(sitemapRoutes)].filter(v => !!v)

          // https://github.com/ekalinin/sitemap.js#generate-a-one-time-sitemap-from-a-list-of-urls
          const stream = new SitemapStream({hostname: options.hostname})
          return await streamToPromise(Readable.from(sitemapRoutes).pipe(stream)).then(data =>
              data.toString()
          )
      }

      function createSitemapFile(sitemap: string, filepath: string) {
          const dirPath = dirname(filepath)
          mkdirSync(dirPath, {recursive: true})
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

      nuxt.hook('pages:extend', async pages => {
          const sitemap = await generateSitemap(pages)
          createSitemapFile(sitemap, filePath)
          // Added output to confirm that the sitemap has been created at the end of the build process
          console.log(`Sitemap created (${sitemapRoutes.length} URLs)`)
          if (options.verbose) {
              console.log('-----------------------')
              console.log(sitemapRoutes.join("\r\n"))
              console.log('-----------------------')
          }
      })
  },
})
