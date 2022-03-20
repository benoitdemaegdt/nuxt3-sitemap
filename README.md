# nuxt3-sitemap
So far the official [nuxt/sitemap](https://sitemap.nuxtjs.org/) module [does not support Nuxt3](https://github.com/nuxt-community/sitemap-module/discussions/234).

Here is a simple way to add a sitemap to your Nuxt3 app.

## Setup
1. install sitemap.js as a dev dependency
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
  buildModules: ['~/modules/sitemap'],
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

## Limitations

- This only works with static pages. Feel free to edit the code if you want to handle dynamic pages.
- This does not work in dev mode (you will not be able to access the sitemap.xml when running `npm run dev`).
