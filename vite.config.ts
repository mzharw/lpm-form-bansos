import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'


// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    ssr: {
        noExternal: ['naive-ui', 'vueuc', 'date-fns']
    },
})
