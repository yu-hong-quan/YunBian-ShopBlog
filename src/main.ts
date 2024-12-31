import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import VueLazyload from 'vue-lazyload';
import { ObserveVisibility } from 'vue-observe-visibility';
import mavonEditor from 'mavon-editor'
import '@/styles/global.css'
import 'mavon-editor/dist/css/index.css'
import './assets/styles/reset.css'

const app = createApp(App)

// 注册指令和插件
app.directive('observe-visibility', ObserveVisibility)
app.use(VueLazyload, {
  preLoad: 1.3,
  error: 'https://picsum.photos/200/200?blur=10',
  loading: 'https://picsum.photos/200/200?grayscale',
  attempt: 1
})
app.use(mavonEditor)
app.use(router)

router.isReady().then(() => {
  app.mount('#app')
}) 