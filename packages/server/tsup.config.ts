import fs from 'node:fs/promises';
import path from 'node:path';
import { defineConfig } from 'tsup';

export default defineConfig({
  dts: false,
  entry: ['src/**/*.{ts,tsx}'],
  format: ['cjs', 'esm'],
  clean: true,
  esbuildPlugins: [
    {
      name: 'add-js',
      setup(build) {
        build.onResolve({ filter: /.*/ }, async (args) => {
          if (args.importer && !args.path.endsWith('.js')) {
            const isFile = await fs
              .lstat(
                path.resolve(path.dirname(args.importer), args.path + '.ts')
              )
              .then((stat) => stat.isFile())
              .catch(() => false);
            return {
              path:
                args.path +
                (args.path.startsWith('.')
                  ? isFile
                    ? '.js'
                    : '/index.js'
                  : ''),
              external: true
            };
          }
        });
      }
    }
  ],
  bundle: true,
  tsconfig: 'tsconfig.json'
});
