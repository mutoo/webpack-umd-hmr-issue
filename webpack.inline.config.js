module.exports = {
    mode: 'development',
    entry: './src/index.js',
    devtool: 'inline-source-map',
    output: {
        filename: "hello.js",
        library: {
            type: "umd",
            name: 'api',
        }
    },
    devServer: {
        hot: true,
        inline: true,
    },
}