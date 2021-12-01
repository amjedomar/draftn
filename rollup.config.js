import fs from 'fs';
import path from 'path';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';

// clean up the dist
const distPath = path.join(__dirname, 'dist');

if (fs.existsSync(distPath)) {
  fs.readdirSync(distPath).forEach((file) => {
    const filePath = path.join(__dirname, 'dist', file);

    if (file !== 'index.js' && file !== 'index.d.ts') {
      fs.rmSync(filePath, { recursive: true });
    } else {
      fs.writeFileSync(filePath, '');
    }
  });
}

/** @type {import('rollup').RollupOptions} */
const options = {
  input: './src/index.tsx',
  output: {
    dir: './dist',
    format: 'cjs',
  },
  plugins: [
    typescript(),
    postcss({
      modules: {
        generateScopedName: 'Draftn[name]_[local]',
      },
      autoModules: false,
    }),
  ],
  external: (id) => !id.startsWith('.') && !path.isAbsolute(id),
};

export default options;