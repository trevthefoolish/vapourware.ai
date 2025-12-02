import { createApp } from 'vue'
import App from './App.vue'
import './assets/styles/main.css'

// Wait for fonts to load before mounting
document.fonts.ready.then(() => {
  createApp(App).mount('#app')
})
