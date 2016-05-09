var path = require("path");
var webpack = require("webpack");

var JS_ROOT = path.resolve("./src/main/webapp/resources/js/");
var VENDOR_ROOT = JS_ROOT + "/vendor/";

module.exports = {
    entry: {
        app: "expose?app!./src/main/webapp/resources/js/app.jsx",
        basic: ["expose?$!jquery",
            "formValidation",
            "formValidationBootstrap",
            "i18n",
            "./src/main/webapp/resources/js/stylesheets.js"]
    },

    output: {
        path: "./src/main/resources/static/js/compiled",
        publicPath: "/js/compiled/",
        filename: "[name].js",
        sourceMapFilename: "[name].js.map",
        chunkFilename: "[chunkhash].js"
    },

    cache: true,
    debug: true,
    devtool: "source-map",

    module: {
        loaders: [
            // **IMPORTANT** This is needed so that each bootstrap js file required by
            // bootstrap-webpack has access to the jQuery object
            { test: /bootstrap\/js\//, loader: 'imports?jQuery=jquery' },
            { test: /\.scss$/,  loader: 'style!css!sass' },
            { test: /\.js$/, loader: 'babel', exclude: "/node_modules/", query: {cacheDirectory: true, presets: ['es2015', 'react']}},
            { test: /\.jsx$/, loader: 'babel', exclude: "/node_modules/", query: {cacheDirectory: true, presets: ['es2015', 'react']}},
            { test: /\.less$/, loader: 'style-loader!css-loader!less-loader'},
            { test: /\.css$/, loader: 'style-loader!css-loader'},
            { test: /\.woff(2)?(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff" },
            { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream" },
            { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
            { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml" },
            { test: /\.json$/, loader: "json-loader"}
        ],
        noParse: /node_modules\/quill\/dist/
    },

    node: {
        net: 'empty'
    },

    resolve: {
        alias: {
            formValidation: VENDOR_ROOT + "formValidation",
            formValidationBootstrap: VENDOR_ROOT + "formValidation-bootstrap",
            i18n: VENDOR_ROOT + "jquery.i18n.properties"
        },
        extensions: ['', '.js', '.jsx', '.css', '.scss']

    },

    plugins: [
        new webpack.ProvidePlugin({
            // Automtically detect jQuery and $ as free var in modules
            // and inject the jquery library
            // This is required by many jquery plugins
            jQuery: "jquery",
            $: "jquery"
        })
    ]
};
