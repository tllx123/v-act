import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { viteBuild } from './build.js'
import { viteServ } from './dev.js'
import { buildTsConfigPaths } from './env.js'
import { createWidget } from './create.js'
yargs(hideBin(process.argv))
  /**
   * Serv
   */
  .command({
    command: 'dev',
    handler: (argv) => viteServ(argv.scope)
  })

  /**
   * Create
   */
  .command({
    command: 'create',
    handler: (argv) => createWidget(argv)
  })

  /**
   * Build
   */
  .command({
    command: 'build',
    handler: async (argv) => viteBuild(argv.scope)
  })
  .option('scope', { alias: 's' })

  /**
   * TSC
   */
  .command({
    command: 'tsc',
    handler: async () => buildTsConfigPaths()
  })
  .parse()
