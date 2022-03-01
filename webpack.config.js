const path = require('path');

module.exports = {
    mode: "development", // "production" | "development" | "none"
    // Chosen mode tells webpack to use its built-in optimizations accordingly.
    entry: "./index.js", // string | object | array
    // defaults to ./src
    // Here the application starts executing
    // and webpack starts bundling
    output: {
      // options related to how webpack emits results
      // the target directory for all output files
      // must be an absolute path (use the Node.js path module)
      path: path.join(__dirname, 'dist'),
      filename: "./looker_hello_world_viz_min.js", // string (default)
    },
    devServer: {
      hot: true,
      https: true,
      static: {
        directory: path.join(__dirname, 'dist'),
      },
    },
}