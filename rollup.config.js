import fs from 'fs';
import path from 'path';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
// eslint-disable-next-line import/no-unresolved
import { minify } from 'csso';
import cssText from 'rollup-plugin-css-text';

const SRC_PATH = path.join(__dirname, 'src');
const DIST_PATH = path.join(__dirname, 'dist');

// clean up the dist
if (fs.existsSync(DIST_PATH)) {
  fs.readdirSync(DIST_PATH).forEach((filename) => {
    const filePath = path.join(DIST_PATH, filename);

    if (filename !== 'index.js' && filename !== 'index.d.ts') {
      fs.rmSync(filePath, { recursive: true });
    } else {
      fs.writeFileSync(filePath, '');
    }
  });
}

// processCssEntry
const processCssEntry = () => ({
  name: 'process-css-entry',
  async writeBundle() {
    const cssEntryPath = path.join(SRC_PATH, 'styles', 'index.css');
    const cssOutputPath = path.join(DIST_PATH, 'index.css');

    const cssEntry = fs.readFileSync(cssEntryPath, 'utf8');

    const cssOutput = fs.readFileSync(cssOutputPath, 'utf8');

    const combinedCss = cssEntry + cssOutput;

    const minifiedCss = minify(combinedCss, {
      comments: 'exclamation',
    }).css;

    fs.writeFileSync(cssOutputPath, minifiedCss);
  },
});

/** @type {import('rollup').RollupOptions} */
const options = {
  input: path.join(SRC_PATH, 'index.tsx'),
  output: {
    dir: DIST_PATH,
    format: 'cjs',
    exports: 'named',
  },
  plugins: [
    typescript(),
    postcss({
      modules: {
        generateScopedName: 'Draftn[name]_[local]',
      },
      autoModules: false,
      extract: true,
    }),
    processCssEntry(),
    cssText({ constName: 'DRAFTN_CSS' }),
  ],
  external: (id) => !id.startsWith('.') && !path.isAbsolute(id),
};

export default options;
