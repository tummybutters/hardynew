const webpack = require('webpack');

module.exports = function override(config, env) {
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
