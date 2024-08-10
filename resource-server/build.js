// build.js
const esbuild = require('esbuild');
const aliasPlugin = require('esbuild-plugin-alias');
const { copy } = require('esbuild-plugin-copy');

esbuild
  .build({
    entryPoints: ['src/app.ts'],
    bundle: true,
    platform: 'node',
    target: 'node20', // or your target environment
    outdir: 'dist',
    plugins: [
      aliasPlugin({
        '@api/*': 'src/api/*',
        '@config/*': 'src/config/*',
        '@config': 'src/config/index',
        '@common/*': 'src/common/*',
        '@lib/*': 'src/lib/*',
        '@middleware/*': 'src/middleware/*',
        '@localtypes/*': 'src/types/*'
      }),
      copy({
        resolveFrom: 'cwd',
        assets: {
          from: ['./assets/*'],
          to: ['./dist/assets'],
        },
        watch: true,
      }),
    ],
    tsconfig: 'tsconfig.build.json' // Specify your custom tsconfig file here
  })
  .catch(() => process.exit(1));
