const path = require("path");

const OUTPUT_DIR = path.resolve(__dirname, "public");
const ENTRY_POINT = path.resolve(__dirname, "client/index.ts");
const TSCONFIG_FILE = path.resolve(__dirname, "tsconfig.webpack.json");

const isProd = process.env.NODE_ENV === "production";

module.exports = {
  mode: isProd ? "production" : "development",
  entry: ENTRY_POINT,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [{ loader: "ts-loader", options: { configFile: TSCONFIG_FILE } }],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "index.js",
    path: OUTPUT_DIR,
  },
};
