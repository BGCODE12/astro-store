import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router/index.js'
import i18n from './i18n/index.js'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(i18n)

// Initialize UI store (sets correct document direction)
import('./stores/useUiStore.js').then(({ useUiStore }) => {
  const uiStore = useUiStore()
  uiStore.init()
})

app.mount('#app')
