import { createI18n } from 'vue-i18n'
import ar from './ar.js'
import en from './en.js'

const savedLocale = localStorage.getItem('astro_locale') || 'ar'

export const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'ar',
  messages: { ar, en },
})

export default i18n
