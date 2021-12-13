import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import { viteBuild } from './build.js'
import { viteServ } from './dev.js'
import { buildTsConfigPaths } from './env.js'

yargs(hideBin(process.argv))
  /**
   * Serv
   */
  .command({
    command: 'dev',
    handler: (argv) => viteServ(argv.scope)
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
