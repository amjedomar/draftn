import fs from 'fs';
import path from 'path';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';

const distPath = path.join(__dirname, 'dist');
const publicPath = path.join(__dirname, 'public');

// clean up the dist
if (fs.existsSync(distPath)) {
  fs.readdirSync(distPath).forEach((filename) => {
    const filePath = path.join(distPath, filename);

    if (filename !== 'index.js' && filename !== 'index.d.ts') {
      fs.rmSync(filePath, { recursive: true });
    } else {
      fs.writeFileSync(filePath, '');
    }
  });
}

// copyPublic
const copyPublic = () => ({
  name: 'copy-public',
  writeBundle() {
    const files = {};

    fs.readdirSync(publicPath).forEach((filename) => {
      const filePath = path.join(publicPath, filename);
      const fileContent = fs.readFileSync(filePath).toString();

      files[filename] = fileContent.replace(
        /\/\*inject(-with-escape)? (.+?)\*\//,
        (_match, p1, injectPath) => {
          const isWithEscape = p1 === '-with-escape';

          let injectContent = fs
            .readFileSync(path.join(__dirname, injectPath))
            .toString();

          if (isWithEscape) {
            injectContent = injectContent.replace(/('|")/g, '\\$1');
          }

          return injectContent;
        },
      );
    });

    Object.entries(files).forEach(([fileName, fileContent]) => {
      const filePath = path.join(distPath, fileName);
      fs.writeFileSync(filePath, fileContent);
    });
  },
});

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
      minimize: true,
      extract: true,
    }),
    copyPublic(),
  ],
  external: (id) => !id.startsWith('.') && !path.isAbsolute(id),
};

export default options;
