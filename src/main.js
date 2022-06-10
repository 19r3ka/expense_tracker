import 'primevue/resources/themes/saga-green/theme.css' //theme
import 'primevue/resources/primevue.min.css' //core css
import 'primeicons/primeicons.css' //icons
import 'animate.css' //animations

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'

const app = createApp(App)
const store = createPinia()

app.use(PrimeVue)
app.use(router)
app.use(store)
app.use(ConfirmationService)
app.use(ToastService)

app.mount('#app')
