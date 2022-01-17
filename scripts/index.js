import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import { viteBuild } from './build.js'
import { createWidget } from './create.js'
import { viteServ } from './dev.js'
import { buildEnv } from './env.js'

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
    handler: async (argv) => viteBuild(argv.scope, argv.copy, argv.watch)
  })
  .option('scope', { alias: 's' })
  .option('watch', { alias: 'w' })
  .option('copy', { alias: 'cp' })

  /**
   * Env
   */
  .command({
    command: 'env',
    handler: async () => buildEnv()
  })
  .parse()
