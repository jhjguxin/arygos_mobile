import { config as devConfig } from '@/config/default'
import { config as prodConfig } from '@/config/production'

const isProd = import.meta.env.MODE === 'production'
const config = isProd ? { ...devConfig, ...prodConfig } : devConfig

export { config }