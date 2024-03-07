import fs from 'fs/promises';
import path from 'path';
import { defineConfig, Options } from 'tsup';

export default defineConfig((options: Options) => ({
  dts: false,
  entry: ['src/**/*.{ts,tsx}'],
  clean: true,
  bundle: true,
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
  tsconfig: 'tsconfig.json',
  format: ['cjs', 'esm'],
  ...options
}));
