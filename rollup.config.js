import sass from 'rollup-plugin-sass'
import { uglify } from 'rollup-plugin-uglify'
import typescript from 'rollup-plugin-typescript2'
import json from '@rollup/plugin-json'

import pkg from './package.json'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
      strict: false,
    },
    {
      file: 'dist/index.esm.js',
      // dir: 'dist',
      format: 'esm',
      exports: 'named',
      sourcemap: true,
      strict: false,
    },
    // {
    //   file: 'dist/index.umd.js',
    //   // dir: 'dist',
    //   format: 'umd',
    //   exports: 'named',
    //   globals: {
    //     swr: 'useSWR',
    //     axios: 'axios',
    //     react: 'react',
    //     'prop-types': 'PropTypes',
    //   },
    //   name: 'index',
    //   sourcemap: true,
    //   strict: false,
    // },
  ],
  plugins: [sass({ insert: true }), typescript(
    {
      exclude: 'node_modules/**',
    }
  ), uglify(), json()],
  external: ['react', 'react-dom', 'swr', 'axios', 'prop-types'],
}
