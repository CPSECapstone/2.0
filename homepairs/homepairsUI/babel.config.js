module.exports = function(api) {
    api.cache(true);
    return {
        presets: [
            'babel-preset-expo',
        ],
        plugins: [
            [
                'module-resolver',
                {
                    extensions: [
                        '.js',
                        '.jsx',
                        '.ts',
                        '.tsx',
                        '.android.js',
                        '.android.tsx',
                        '.ios.js',
                        '.ios.tsx',
                        '.web.js',
                        '.web.tsx',
                    ],
                    root: ['.'],
                    alias: {
                        'homepairs-fonts': './res/fonts',
                        'homepairs-images': './res/images.tsx',
                        'homepairs-strings': './res/strings.tsx',
                        'homepairs-colors': './res/colors.tsx',
                        'homepairs-types': './src/state/types.ts',
                        'homepairs-elements': './src/elements/index.tsx',
                        'homepairs-redux-actions': './src/state/actions.ts',
                        'homepairs-pages': './src/screens/index.tsx',
                        'homepairs-modals': './src/modals/index.tsx',
                        'homepairs-base-styles': './res/Styles/base.ts',
                        'homepairs-components': './src/components/index.tsx',
                        'homepairs-utilities': './src/utility/index.tsx',
                        'homepairs-routes' : './src/routes/index.tsx',
                        'homepairs-endpoints' : './src/endpoints/index.ts',
                        'homepairs-test' : './tests/fixtures/index',
                    },
                },
            ],
        ],
        sourceMaps: true,
    };
};
