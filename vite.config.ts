import { defineConfig } from "vite";

const hosts = ["m4air", "m4air.local", "iphone-14-pro-max", ".ts.net"];

export default defineConfig({
  server: { host: true, port: 4731, strictPort: true, allowedHosts: hosts },
  preview: { host: true, port: 4732, strictPort: true, allowedHosts: hosts },
  build: { target: "es2022", sourcemap: true },
});
