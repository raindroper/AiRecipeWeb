import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/main.css'
import '@varlet/ui/es/style'

import App from './App.vue'
import router from './router'

import { Themes, StyleProvider } from '@varlet/ui'
StyleProvider({
  ...Themes.md3Light,
  '--color-primary': '#f97316',
  '--color-link': '#f97316',
  '--color-success': '#10b981',
  '--color-info': '#fb923c',
  '--bottom-navigation-background-color': '#ffffff',
  '--bottom-navigation-item-active-background-color': '#fff7ed',
  '--bottom-navigation-item-active-color': '#f97316',
  '--ripple-color': 'transparent',
  '--card-background': '#ffffff',
  '--popup-content-background-color': '#ffffff',
  '--dialog-background': '#ffffff',
  '--app-bar-color': '#fffbf5',
  '--body-background': '#fffbf5',
})

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
