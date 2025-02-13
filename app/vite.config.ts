import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import viteCompression from "vite-plugin-compression";
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const envDir = path.resolve(__dirname, "..");
    const env = loadEnv(mode, envDir, "");
    return {
        plugins: [
            react(),
            TanStackRouterVite(),
            viteCompression({
                algorithm: "brotliCompress",
                ext: ".br",
                threshold: 1024,
            }),
        ],
        server: {
          host: true,
          port: 5173,
          allowedHosts: ["app-synapze.open4glabs.xyz","app.synapze.xyz"],
          cors: false,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
          },
          /*proxy: {
            '/api/db': {
                target: env.API_DB_HOST_URL || "http://localhost:8787",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\/db/, '')
            },
            '/api/agent': {
                target: env.API_HOST_URL || "http://localhost:8387",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\/agent/, '')
            },
          }*/
        },
        clearScreen: false,
        envDir,
        define: {
            "import.meta.env.VITE_API_DB_HOST_URL": JSON.stringify(
              env.API_DB_HOST_URL || "http://localhost:8787"
            ),
              "import.meta.env.VITE_API_HOST_URL": JSON.stringify(
                env.API_HOST_URL || "http://localhost:8387"
            ),
            "import.meta.env.VITE_SERVER_PORT": JSON.stringify(
                env.SERVER_PORT || "5173"
            ),
            "import.meta.env.VITE_JWT_DB_API": JSON.stringify(
              env.JWT_DB_API || ""
            ),
            "import.meta.env.VITE_JWT_AGENT_API": JSON.stringify(
              env.JWT_AGENT_API || ""
            ),
            "import.meta.env.VITE_JWT_INTEGRATIONS_API": JSON.stringify(
              env.JWT_INTEGRATIONS_API || ""
            ),
        },
        build: {
            outDir: "dist",
            minify: true,
            cssMinify: true,
            sourcemap: false,
            cssCodeSplit: true,
        },
        resolve: {
            alias: {
              '@': path.resolve(__dirname, './src'),

              // fix loading all icon chunks in dev mode
              // https://github.com/tabler/tabler-icons/issues/1233
              '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
            },
        },
    };
});
