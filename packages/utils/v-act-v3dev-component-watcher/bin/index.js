#!/usr/bin/env node

const index = require('../index')

const v3devCmpDir = process.argv[2]
index.watch(v3devCmpDir)
