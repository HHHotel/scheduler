module.exports = {
    target: "electron-renderer",
    mode: "development",
    devtool: "inline-source-map",
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
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            { test: /\.tsx?$/, loader: "ts-loader" }
        ]
    }
};
