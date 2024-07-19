import { defineConfig } from 'vite';
import { installGlobals } from '@remix-run/node';
import { vitePlugin as remix } from '@remix-run/dev';
import tsconfigPaths from 'vite-tsconfig-paths';
import { vercelPreset } from '@vercel/remix/vite';

installGlobals()

export default defineConfig({
    server: {
        port: 3000
    },
    plugins: [
        remix({
            ignoredRouteFiles: ['**/.*'],
            presets: [vercelPreset()]
        }),
        tsconfigPaths()
    ],
    ssr: {
        noExternal: ["remix-utils"],
        external: [/^@?mongodb.*/, "bson"]
    },
    // build: {
    //     commonjsOptions: {
    //         transformMixedEsModules: true
    //     }
    // }
});
