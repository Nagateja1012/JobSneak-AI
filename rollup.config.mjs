import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import copy from "rollup-plugin-copy";
import url from "@rollup/plugin-url";

export default [
  {
    input: "AI scripts/summarizer.js",
    output: {
      dir: "dist/AI scripts",
      format: "iife",
    },
    plugins: [
      commonjs(),
      nodeResolve(),
      copy({
        targets: [
          {
            src: [
              "manifest.json",
              "background.js",
              "sidepanel",
              "images",
              "AI scripts",
            ],
            dest: "dist",
          },
        ],
      }),
    ],
  },
  {
    input: "scripts/extract-content.js",
    output: {
      dir: "dist/scripts",
      format: "es",
    },
    plugins: [commonjs(), nodeResolve()],
  },
  {
    input: "sidepanel/sidepanel.js",
    output: {
      file: "dist/sidepanel/sidepanel.js",
      format: "iife",
      name: "Popup",
    },
    plugins: [
      nodeResolve(),
      commonjs(),
      url({
        include: ["node_modules/pdfjs-dist/build/*.worker.min.mjs"],
        limit: 0,
        publicPath: "",
      }),
    ],
  },
];
