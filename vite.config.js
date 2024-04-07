import mdx from "@mdx-js/rollup";
import { defineConfig } from "vite"
import { flatRoutes } from 'remix-flat-routes'
import remarkFrontmatter from "remark-frontmatter";
import { vitePlugin as remix } from "@remix-run/dev";
import { visualizer } from "rollup-plugin-visualizer";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";

export default defineConfig({
    server: {
        port: 3000,
    },
    resolve: {
        alias: {
            app: "/app",
        },
    },
    plugins: [
        mdx({
            remarkPlugins: [
                remarkFrontmatter,
                remarkMdxFrontmatter,
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