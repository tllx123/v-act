#!/usr/bin/env node

const path = require('path')
const index = require('../src/index')
const Cache = require('../src/utils/Cache')

Cache.scanVActWidgets()
const cwd = process.cwd()
index.watch(path.resolve(cwd, 'v3dev'))
