const mix = require('laravel-mix');
const webpack = require('webpack');
const tailwindcss = require('tailwindcss');
const WebpackObfuscator = require('webpack-obfuscator');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');

let webPackPlugins = [
    // new webpack.ProvidePlugin({
    //     $: 'jquery',
    //     jQuery: 'jquery',
    //     'window.jQuery': 'jquery',
    // }),
];

if (mix.inProduction()) {
    webPackPlugins = [
        ...webPackPlugins,
        ...[
            new WebpackObfuscator(
                {
                    rotateStringArray: true,
                },
                ['/js/vendor.js', '/js/manifest.js'] // Files to exclude
            ),
            new MomentLocalesPlugin(), // Exlclude Moment js plugin locales
        ],
    ];
}

mix.webpackConfig({
    plugins: webPackPlugins,
});

// mix.webpackConfig({
//     plugins: webPackPlugins,
//     resolve: {
//         alias: {
//             jquery: path.join(__dirname, 'node_modules/jquery/src/jquery'),
//         },
//     },
// });

mix.copyDirectory('node_modules/font-awesome/fonts/*', 'fonts');

mix.setPublicPath('assets/');
mix.setResourceRoot('../');

if (!mix.inProduction()) {
    mix.webpackConfig({
        devtool: 'source-map',
    }).sourceMaps();
}

mix.js('src/js/game.js', 'js/game.js').extract();
mix.autoload({ jquery: ['$', 'window.jQuery', 'jQuery'] });

mix.sass('src/sass/game.scss', 'css/game.css').options({
    extractVueStyles: true,
    postCss: [tailwindcss('./tailwind.config.js')],
    uglify: true,
});

// mix.browserSync({
//     proxy: 'http://localhost/airplane',
//     files: ['assets/css/*.*', 'assets/js/*.*', 'index.html'],
// });

//const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
// require('laravel-mix-purgecss');

// mix.disableNotifications();

// let WebpackNotifierPlugin = require('webpack-notifier');
// mix.webpackConfig(() => {
//     return {
//         plugins: [
//             new WebpackNotifierPlugin()
//         ]
//     };
// });

// mix.webpackConfig({
//     plugins: [
//         new UglifyJSPlugin({
//             uglifyOptions: {
//                 mangle: true,
//                 output: {
//                     comments: false,
//                 },
//             },
//             sourceMap: true,
//             exclude: [/\.min\.js$/gi],
//             chunkFilter: (chunk) => {
//                 // Exclude uglification for the `vendor` chunk
//                 if (
//                     chunk.name === '/js/vendor' ||
//                     chunk.name === '/js/manifest'
//                 ) {
//                     return false;
//                 }

//                 return true;
//             },
//         }),
//     ],
// });

// .purgeCss({
//     enabled: mix.inProduction(),
//     // folders: ['src'],
//     // extensions: ['html', 'js', 'php', 'vue'],
// });

// Full API
// mix.js(src, output);
// mix.react(src, output); <-- Identical to mix.js(), but registers React Babel compilation.
// mix.preact(src, output); <-- Identical to mix.js(), but registers Preact compilation.
// mix.coffee(src, output); <-- Identical to mix.js(), but registers CoffeeScript compilation.
// mix.ts(src, output); <-- TypeScript support. Requires tsconfig.json to exist in the same folder as webpack.mix.js
// mix.extract(vendorLibs);
// mix.sass(src, output);
// mix.standaloneSass('src', output); <-- Faster, but isolated from Webpack.
// mix.fastSass('src', output); <-- Alias for mix.standaloneSass().
// mix.less(src, output);
// mix.stylus(src, output);
// mix.postCss(src, output, [require('postcss-some-plugin')()]);
// mix.browserSync('my-site.test');
// mix.combine(files, destination);
// mix.babel(files, destination); <-- Identical to mix.combine(), but also includes Babel compilation.
// mix.copy(from, to);
// mix.copyDirectory(fromDir, toDir);
// mix.minify(file);
// mix.sourceMaps(); // Enable sourcemaps
// mix.version(); // Enable versioning.
// mix.disableNotifications();
// mix.setPublicPath('path/to/public');
// mix.setResourceRoot('prefix/for/resource/locators');
// mix.autoload({}); <-- Will be passed to Webpack's ProvidePlugin.
// mix.webpackConfig({}); <-- Override webpack.config.js, without editing the file directly.
// mix.babelConfig({}); <-- Merge extra Babel configuration (plugins, etc.) with Mix's default.
// mix.then(function () {}) <-- Will be triggered each time Webpack finishes building.
// mix.extend(name, handler) <-- Extend Mix's API with your own components.
// mix.options({
//   extractVueStyles: false, // Extract .vue component styling to file, rather than inline.
//   globalVueStyles: file, // Variables file to be imported in every component.
//   processCssUrls: true, // Process/optimize relative stylesheet url()'s. Set to false, if you don't want them touched.
//   purifyCss: false, // Remove unused CSS selectors.
//   uglify: {}, // Uglify-specific options. https://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
//   postCss: [] // Post-CSS options: https://github.com/postcss/postcss/blob/master/docs/plugins.md
// });
