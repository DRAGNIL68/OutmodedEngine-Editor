
import typescript from '@rollup/plugin-typescript';
import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';

// i HATE rollup and the javascript ecosystem
// i spent 1hr and a shit ton of ai help to get this stupid ass
//config to work with blockbench.

// I despise the way that imports work,
// I like to know what is doing what.
// So far i have only ever found 2 programing languages that make me genuinely get angry,
// gdscript and the ENTIRE javascript ecosystem, with the excpetion of svelte, make me feel
// like i am actively fighting the language to do what i want.

// this could just be a skill issue on my part but its starting to really tick me off.
// if god is real he has a twisted sense of humor to let javascript be the #1 web language. 

export default {
  input: 'src/register.ts',
  output: {
    file: 'bundle.js',
    format: 'iife'
  },
  plugins: [
	typescript(),]
}