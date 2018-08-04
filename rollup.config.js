import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import {uglify} from 'rollup-plugin-uglify';

import rollupAll from 'rollup-all';

let plugins = [
    resolve(),
    babel({
        exclude: 'node_modules/**',
        plugins: ['external-helpers']
    })
];

export default rollupAll.getExports(uglify(), plugins);