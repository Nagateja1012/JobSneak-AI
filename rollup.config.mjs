import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import url from '@rollup/plugin-url';

export default [
  {
    input: 'sidepanel/index.js',
    output: {
      dir: 'dist/sidepanel',
      format: 'iife',
    },
    plugins: [
      commonjs(),
      nodeResolve(),
      copy({
        targets: [
          {
            src: ['manifest.json', 'background.js', 'sidepanel', 'images', 'popup'],
            dest: 'dist'
          }
        ]
      })
    ]
  },
  {
    input: 'scripts/extract-content.js',
    output: {
      dir: 'dist/scripts',
      format: 'es'
    },
    plugins: [
      commonjs(),
      nodeResolve(),
    ]
  },
  {
    input: "popup/popup1.js",
    output: {
      file: "dist/popup/popup1.js",
      format: "iife", // Immediately Invoked Function Expression for browser compatibility
      name: "Popup"
    },
    plugins: [
      nodeResolve(), // Resolves `node_modules` dependencies
      commonjs(),
      url({
        include: ["node_modules/pdfjs-dist/build/*.worker.min.mjs"],
        limit: 0, 
        publicPath: "",
      }) 
    ]
  }
];
