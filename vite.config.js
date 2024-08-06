import mdx from "@mdx-js/rollup";
import { defineConfig } from "vite"
import { vitePlugin as remix } from "@remix-run/dev";
import { visualizer } from "rollup-plugin-visualizer";
import { flatRoutes } from 'remix-flat-routes'
import remarkFrontmater from "remark-frontmatter";
import remarkMdxFrontmater from "remark-mdx-frontmatter";
import path from "path";

export default defineConfig({
    server: {
        port: 3000,
    },
    resolve: {
        alias: {
            app: path.resolve(__dirname, "./app"),
            root: path.resolve(__dirname, "."),
        },
    },
    plugins: [
        mdx({
            remarkPlugins: [
                remarkFrontmater,
                remarkMdxFrontmater,
            ],
        }),
        remix({
            ignoredRouteFiles: ['**/*'],
            routes: async defineRoutes => {
                return flatRoutes('routes', defineRoutes)
            },
        }),
        visualizer({ emitFile: true }),
    ],
});