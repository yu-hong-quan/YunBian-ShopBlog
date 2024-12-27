/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'vue-lazyload' {
  import { Plugin } from 'vue'
  const VueLazyload: Plugin
  export default VueLazyload
}

declare module 'vue-observe-visibility' {
  export const ObserveVisibility: any
  export const vObserveVisibility: any
} 