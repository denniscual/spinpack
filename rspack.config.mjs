import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import rspack from "@rspack/core";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('@rspack/cli').Configuration} */
export default {
  target: "node",
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        loader: "builtin:swc-loader",
        options: {
          jsc: {
            parser: {
              syntax: "typescript",
            },
          },
        },
        type: "javascript/auto",
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  entry: {
    main: resolve(__dirname, "src", "index.ts"),
  },
  output: {
    path: resolve(__dirname, "dist"),
    filename: "index.js",
  },
  devtool: false,
  plugins: [new rspack.BannerPlugin({ banner: "#!/usr/bin/env node" })],
};
