import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            // 不做更新弹窗，让新版本在后续重新打开应用时生效
            registerType: 'prompt',

            manifest: {
                name: '此间',
                short_name: '此间',
                description: '一个安静的文字记录空间',
                start_url: '/',
                scope: '/',
                // App 被安装后以独立窗口运行，而不是普通浏览器标签页
                display: 'standalone',
                background_color: '#FFFFFF',
                theme_color: '#FFFFFF',

                icons: [
                    {
                        src: '/pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: '/pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                ],
            },

            // 告诉 Service Worker 要缓存哪些构建后的资源
            workbox: {
                globPatterns: [
                    '**/*.{js,css,html,ico,png,svg,webp,woff,woff2}',
                ],
                maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
            },
        }),
    ],
})
