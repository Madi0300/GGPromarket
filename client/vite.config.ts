import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig(({ mode }) => {
  const base = mode === "production" ? "/GGPromarket/" : "/";
  return {
    base: base,
    plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./app/routes"),
        "#": path.resolve(__dirname, "./app/store"),
      },
    },
  };
});
