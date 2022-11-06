# Sitemap generation for Nuxt3
So far the official [nuxt/sitemap](https://sitemap.nuxtjs.org/) module [does not support Nuxt3](https://github.com/nuxt-community/sitemap-module/discussions/234).
Here is a simple way to add a sitemap to your Nuxt3 app.

## Example
An example of a sitemap rendered with this code can be found [here](https://monpetitsommet.fr/sitemap.xml).

<img width="964" alt="Capture d’écran 2022-11-06 à 13 28 59" src="https://user-images.githubusercontent.com/25749578/200170813-28c50ecb-989c-4311-9f11-49a25931cee6.png">


## Setup for a very simple static site (no dynamic page)
1. install [sitemap.ts](sitemap.ts) as a dev dependency
```bash
npm install --save-dev sitemap
```

2. create a new file in the modules folder
```bash
mkdir modules && touch modules/sitemap.ts
```

3. copy/paste the content of [sitemap.ts](sitemap.ts)

4. add following lines in you nuxt.config.ts file
```ts
export default defineNuxtConfig({
  // some configs
  modules: ['~/modules/sitemap'],
  sitemap: {
    hostname: 'https://<YOUR_DOMAIN>',
  },
  // more configs
})
```
Don't forget to change <YOUR_DOMAIN> with your actual domain.

5. build your nuxt app and see your sitemap file
```bash
npm run build
```
```bash
npx nuxi preview
```

In your browser go to `http://localhost:3000/sitemap.xml`

### Example
If your pages folder looks like this :

```
pages/
├─ index.vue
├─ blog/
│  ├─ index.vue
│  ├─ first-article.vue
│  ├─ second-article.vue
│  ├─ third-article.vue
```

The generated sitemap will look like this :
![Screenshot](screenshot.png)

## Setup for a dynamic site powered by [@nuxt/content](https://content.nuxtjs.org/) with [prerendering](https://v3.nuxtjs.org/guide/deploy/static-hosting#prerendering)
1. install [sitemap.ts](sitemap.ts) as a dev dependency
```bash
npm install --save-dev sitemap
```

2. create a new file in the modules folder
```bash
mkdir modules && touch modules/sitemap.ts
```

3. copy/paste the content of [sitemap-dynamic.ts](sitemap-dynamic.ts) inside your newly created `modules/sitemap.ts` file.

4. add following lines in you nuxt.config.ts file
```ts
export default defineNuxtConfig({
  // some configs
  modules: ['~/modules/sitemap'],
  sitemap: {
    hostname: 'https://<YOUR_DOMAIN>',
  },
  // more configs
})
```
Don't forget to change <YOUR_DOMAIN> with your actual domain.

5. build your nuxt app and see your sitemap file
```bash
npm run generate
```

Your sitemap is now available in `.output/public/sitemap.xml`


## Credits
Big thanks to
- [Florian Lefebvre](https://github.com/florian-lefebvre) who wrote the original code of this module. See [original Github Discussion](https://github.com/nuxt/framework/discussions/3582) and [original file](https://github.com/florian-lefebvre/portfolio/blob/c513428dea912a19ffb684b8b571b08b8882158c/modules/sitemap.ts).
- [Diizzayy](https://github.com/Diizzayy) who fixed this module. See [this Github Discussion](https://github.com/nuxt/framework/discussions/4568).
- [codeflorist](https://github.com/codeflorist) who found a way to generate sitemaps for prerendered sites.
