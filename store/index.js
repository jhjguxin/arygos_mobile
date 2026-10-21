import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { useAppStore } from './app'

export const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// Non-component accessor. Binds explicitly to our pinia instance so callers
// (services, HTTP layer) need not rely on getActivePinia() being set yet.
export function useStore() {
  return useAppStore(pinia)
}

export { useAppStore }