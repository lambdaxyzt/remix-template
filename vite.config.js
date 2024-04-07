import mdx from "@mdx-js/rollup";
import { vitePlugin as remix } from "@remix-run/dev";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite"

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
        remix(),
        visualizer({ emitFile: true }),
    ],
});