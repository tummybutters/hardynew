const webpack = require('webpack');

module.exports = function override(config, env) {
    // Suppress noisy source map warnings from third-party bundles missing .map files
    const patchSourceMapLoader = (rule) => {
        if (!rule) return false;

        if (rule.loader && rule.loader.includes('source-map-loader')) {
            const exclusion = /@mediapipe[\\/]tasks-vision/;
            rule.exclude = Array.isArray(rule.exclude)
                ? [...rule.exclude, exclusion]
                : [rule.exclude, exclusion].filter(Boolean);
            return true;
        }

        if (Array.isArray(rule.oneOf) && rule.oneOf.some(patchSourceMapLoader)) return true;
        if (Array.isArray(rule.rules) && rule.rules.some(patchSourceMapLoader)) return true;
        if (Array.isArray(rule.use) && rule.use.some(patchSourceMapLoader)) return true;
        return false;
    };

    patchSourceMapLoader(config.module);
    config.ignoreWarnings = [
        ...(config.ignoreWarnings || []),
        /Failed to parse source map.*@mediapipe[\\/]tasks-vision/i,
        /Failed to parse source map/i
    ];

    // Production optimizations
    if (env === 'production') {
        // Enable aggressive code splitting
        config.optimization = {
            ...config.optimization,
            splitChunks: {
                chunks: 'all',
                cacheGroups: {
                    // Separate Three.js and React Three Fiber into their own bundle
                    three: {
                        test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
                        name: 'three',
                        priority: 20,
                    },
                    // Separate other vendor code
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        priority: 10,
                    },
                },
            },
            // Minimize bundle size
            minimize: true,
        };

        // Add compression plugin
        config.plugins.push(
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify('production'),
            })
        );
    }

    return config;
};
