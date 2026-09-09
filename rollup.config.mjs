
import typescript from '@rollup/plugin-typescript';

// rollup.config.mjs
export default {
	input: 'src/register.ts',
	output: {
		file: 'bundle.js',
		format: 'cjs'
	},
	plugins: [
		typescript()
	]
};