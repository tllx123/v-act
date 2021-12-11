import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import { viteBuild } from './build.js'
import { viteServ } from './dev.js'
import { buildTsConfigPath } from './env.js'

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
   * Build tsconfig.path.json
   */
  .command({
    command: 'build tscpath',
    handler: async () => buildTsConfigPath()
  })
  .option('scope', { alias: 's' })
  .parse()
