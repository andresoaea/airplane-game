module.exports = {
    future: {
        // removeDeprecatedGapUtilities: true,
        // purgeLayersByDefault: true,
    },
    purge: {
        content: [
            './index.html',
            './src/js/components/*.vue',
            './src/js/pages/*.vue',
            './src/js/*.js',
            './src/js/*.vue',
        ],
    },
    theme: {
        extend: {},
    },
    variants: {},
    plugins: [],
};
