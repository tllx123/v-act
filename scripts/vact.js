import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import { build as buildWidgets, dev as devWidgets } from './widgets/index.js'

yargs(hideBin(process.argv))
  // vact dev widgets
  .command({
    command: 'dev widgets',
    handler: (argv) => devWidgets(argv)
  })

  // vact build widgets
  .command({
    command: 'build widgets',
    handler: (argv) => buildWidgets(argv)
  })
  .parse()
