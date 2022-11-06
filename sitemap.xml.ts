import { serverQueryContent } from '#content/server'
import { SitemapStream, streamToPromise } from 'sitemap'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const BASE_URL = 'https://<YOUR_DOMAIN>'

export default defineEventHandler(async (event) => {
  const sitemap = new SitemapStream({ hostname: BASE_URL })

  const docs = await serverQueryContent(event).find()
  for (const doc of docs) {
    sitemap.write({ url: doc._path, changefreq: 'monthly' })
  }

  const staticEndpoints = getStaticEndpoints()
  for (const staticEndpoint of staticEndpoints) {
    sitemap.write({ url: staticEndpoint, changefreq: 'monthly' })
  }

  sitemap.end()
  return streamToPromise(sitemap)
})

function getStaticEndpoints(): string[] {
  const __dirname = dirname(fileURLToPath(import.meta.url))
  const files = getFiles(`${__dirname}/../../pages`)
  return files
    .filter((file) => !file.includes('slug')) // exclude dynamic content
    .map((file) => file.split('pages')[1])
    .map((file) => {
      return file.endsWith('index.vue') ? file.split('/index.vue')[0] : file.split('.vue')[0]
    })
}

/**
 * recursively get all files from /pages folder
 */
function getFiles(dir: string): string[] {
  const dirents = fs.readdirSync(dir, { withFileTypes: true })
  const files = dirents.map((dirent) => {
    const res = resolve(dir, dirent.name)
    return dirent.isDirectory() ? getFiles(res) : res
  })
  return files.flat()
}
