import {nodeResolve} from '@rollup/plugin-node-resolve';
// import scss from 'rollup-plugin-scss';
import { terser } from 'rollup-plugin-terser'

export default {
    input: 'index.js',
    output: {
        file: 'index.dist.mjs',
        format: 'esm',
        name: "app"
    },
    plugins: [
        nodeResolve(),
        terser({ compress: { passes: 10, global_defs: {IS_ESM: true} }, ecma: 2015, format: {ecma: 2015, comments: false, indent_level: 0} }),
    ]
}
