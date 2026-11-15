import json from '@rollup/plugin-json';

// bundles the sources and the CMMN JSON schemas into a single ES module, so
// the package can be imported from plain Node (no JSON import attributes)
// and by any bundler; dependencies (moddle, moddle-xml, min-dash) stay
// external
function isExternal(id) {
  return !/^[./]/.test(id);
}

export default {
  input: 'index.js',
  output: {
    file: 'dist/index.js',
    format: 'es',
    sourcemap: true
  },
  external: isExternal,
  plugins: [
    json()
  ]
};
