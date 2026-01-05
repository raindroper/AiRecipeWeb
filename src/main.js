import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/main.css'
import '@varlet/ui/es/style'

import App from './App.vue'
import router from './router'

import { Themes, StyleProvider } from '@varlet/ui'
StyleProvider(Themes.md3Light)

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
