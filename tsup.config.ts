import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src"],
	splitting: false,
	sourcemap: true,
	clean: true,
	dts: true,
	format: ["cjs", "esm"],
	outDir: "dist",
	target: "esnext",
	minify: true,
});
