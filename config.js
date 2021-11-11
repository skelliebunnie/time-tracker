module.exports = {
	config: {
		tailwindjs: "./tailwind.config.js",
		port: 9050
	},
	paths: {
		root: "./",
		src: {
			base: "./src",
			css: "./src/css",
			js: "./src/js",
			img: "./src/img"
		},
		dist: {
			base: "./dist",
			css: "./dist/css",
			js: "./dist/js",
			img: "./dist/img"
		},
		build: {
			base: "./docs",
			css: "./docs/css",
			js: "./docs/js",
			img: "./docs/img"
		}
	}
}