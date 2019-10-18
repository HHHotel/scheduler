module.exports = {
    target: "electron-renderer",
    mode: "production",
    optimization: {
        minimize: false,
    },
    entry: "./app/main.ts",
    output: {
        filename: "bundle.js",
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: [".ts", ".tsx", ".js"]
    },
    module: {
        rules: [
            { 
                test: /\.tsx?$/,
                loader: "ts-loader"
            }
       ]
    }
};
