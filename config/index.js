import { config as devConfig } from '@/config/default'

const isProd = import.meta.env.MODE === 'production'

// production.js is gitignored; use import.meta.glob so fresh clones don't break
let prodConfig = {}
if (isProd) {
  const prodModules = import.meta.glob('./production.*', { eager: true })
  const prodKey = Object.keys(prodModules).find(k => /production\.(js|ts)$/.test(k))
  if (prodKey) {
    prodConfig = prodModules[prodKey].config
  }
}

const config = isProd ? { ...devConfig, ...prodConfig } : devConfig

export { config }