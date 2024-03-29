// @remove-file-on-eject
/**
 * Copyright (c) 2015-present, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict'

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', (err) => {
  throw err
})

const fs = require('fs-extra')
const path = require('path')
const templateUtils = require('./utils/vact/templateUtils')
const configUtils = require('./utils/vact/configUtils')
const fileUtils = require('./utils/vact/fileUtils')
const chalk = require('react-dev-utils/chalk')
const execSync = require('child_process').execSync
const spawn = require('react-dev-utils/crossSpawn')
const { defaultBrowsers } = require('react-dev-utils/browsersHelper')
const os = require('os')
const verifyTypeScriptSetup = require('./utils/verifyTypeScriptSetup')
//判断是否使用极简模式
const minimalism = true
function isInGitRepository() {
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' })
    return true
  } catch (e) {
    return false
  }
}

function isInMercurialRepository() {
  try {
    execSync('hg --cwd . root', { stdio: 'ignore' })
    return true
  } catch (e) {
    return false
  }
}

function tryGitInit() {
  try {
    execSync('git --version', { stdio: 'ignore' })
    if (isInGitRepository() || isInMercurialRepository()) {
      return false
    }

    execSync('git init', { stdio: 'ignore' })
    return true
  } catch (e) {
    console.warn('Git repo not initialized', e)
    return false
  }
}

function tryGitCommit(appPath) {
  try {
    execSync('git add -A', { stdio: 'ignore' })
    execSync('git commit -m "Initialize project using Create React App"', {
      stdio: 'ignore'
    })
    return true
  } catch (e) {
    // We couldn't commit in already initialized git repo,
    // maybe the commit author config is not set.
    // In the future, we might supply our own committer
    // like Ember CLI does, but for now, let's just
    // remove the Git files to avoid a half-done state.
    console.warn('Git commit not created', e)
    console.warn('Removing .git directory...')
    try {
      // unlinkSync() doesn't work on directories.
      fs.removeSync(path.join(appPath, '.git'))
    } catch (removeErr) {
      // Ignore.
    }
    return false
  }
}

function getJuicerObj(datas) {
  let juicerObj = templateUtils.create(datas)
  const slots = configUtils.getTemplateSlot()
  if (slots) {
    for (const key in slots) {
      if (Object.hasOwnProperty.call(slots, key)) {
        const vals = slots[key]
        juicerObj.addSlot[(vals[0], vals[1])]
      }
    }
  }
  return juicerObj
}

module.exports = function (
  appPath,
  appName,
  verbose,
  originalDirectory,
  templateName
) {
  const appPackage = require(path.join(appPath, 'package.json'))
  const useYarn = fs.existsSync(path.join(appPath, 'yarn.lock'))

  if (!templateName) {
    console.log('')
    console.error(
      `A template was not provided. This is likely because you're using an outdated version of ${chalk.cyan(
        'create-react-app'
      )}.`
    )
    console.error(
      `Please note that global installs of ${chalk.cyan(
        'create-react-app'
      )} are no longer supported.`
    )
    console.error(
      `You can fix this by running ${chalk.cyan(
        'npm uninstall -g create-react-app'
      )} or ${chalk.cyan(
        'yarn global remove create-react-app'
      )} before using ${chalk.cyan('create-react-app')} again.`
    )
    return
  }

  const templatePath = path.dirname(
    require.resolve(`${templateName}/package.json`, { paths: [appPath] })
  )

  const juicerObj = getJuicerObj({
    ProjectName: templateName
  })
  let templateDir = path.join(templatePath, 'template')
  if (!fs.existsSync(templateDir)) {
    templateDir = templatePath
  }
  //vact: 优先复制
  fileUtils.copy(templateDir, appPath, (sourcePath, targetPath) => {
    if (sourcePath == path.join(appPath, 'template.json')) {
      return //不用复制template.json
    } else {
      const tarPath = juicerObj
        .parse(targetPath)
        .replace(templateDir, templatePath) //把template去掉
      return tarPath
    }
  })
  // Copy the files for the user
  // const templateDir = path.join(templatePath, 'template');
  // if (fs.existsSync(templateDir)) {
  //   fs.copySync(templateDir, appPath);
  // } else {
  //   console.error(
  //     `Could not locate supplied template: ${chalk.green(templateDir)}`
  //   );
  //   return;
  // }

  const templateJsonPath = path.join(templatePath, 'template.json')

  let templateJson = {}
  if (fs.existsSync(templateJsonPath)) {
    //=====================v3 replace package start =================================
    let tempJson = fs.readFileSync(templateJsonPath).toString()
    tempJson = juicerObj.parse(tempJson)
    templateJson = JSON.parse(tempJson)
    //=====================v3 replace package end =================================
    // templateJson = require(templateJsonPath);
  }
  //vact: 不限制只在package
  const templatePackage = templateJson.package
    ? templateJson.package
    : templateJson //templateJson.package || {};

  // This was deprecated in CRA v5.
  if (templateJson.dependencies || templateJson.scripts) {
    console.log()
    console.log(
      chalk.red(
        'Root-level `dependencies` and `scripts` keys in `template.json` were deprecated for Create React App 5.\n' +
          'This template needs to be updated to use the new `package` key.'
      )
    )
    console.log('For more information, visit https://cra.link/templates')
  }

  // Keys to ignore in templatePackage
  const templatePackageBlacklist = [
    'name',
    'version',
    'description',
    'keywords',
    'bugs',
    'license',
    'author',
    'contributors',
    'files',
    'browser',
    'bin',
    'man',
    'directories',
    'repository',
    'peerDependencies',
    'bundledDependencies',
    'optionalDependencies',
    'engineStrict',
    'os',
    'cpu',
    'preferGlobal',
    'private',
    'publishConfig'
  ]

  // Keys from templatePackage that will be merged with appPackage
  const templatePackageToMerge = ['dependencies', 'scripts']

  // Keys from templatePackage that will be added to appPackage,
  // replacing any existing entries.
  const templatePackageToReplace = Object.keys(templatePackage).filter(
    (key) => {
      return (
        !templatePackageBlacklist.includes(key) &&
        !templatePackageToMerge.includes(key)
      )
    }
  )

  // Copy over some of the devDependencies
  appPackage.dependencies =
    (templateJson.package && templateJson.package.dependencies) ||
    templateJson.dependencies ||
    appPackage.dependencies ||
    {}

  // Setup the script rules
  const templateScripts = templatePackage.scripts || {}
  appPackage.scripts = Object.assign(templateScripts)

  // Update scripts for Yarn users
  if (useYarn) {
    appPackage.scripts = Object.entries(appPackage.scripts).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: value.replace(/(npm run |npm )/, 'yarn ')
      }),
      {}
    )
  }

  // Setup the eslint config
  appPackage.eslintConfig = {
    extends: 'react-app'
  }

  // Setup the browsers list
  appPackage.browserslist = defaultBrowsers

  // Add templatePackage keys/values to appPackage, replacing existing entries
  templatePackageToReplace.forEach((key) => {
    appPackage[key] = templatePackage[key]
  })

  fs.writeFileSync(
    path.join(appPath, 'package.json'),
    JSON.stringify(appPackage, null, 2) + os.EOL
  )

  const readmeExists = fs.existsSync(path.join(appPath, 'README.md'))
  if (readmeExists) {
    fs.renameSync(
      path.join(appPath, 'README.md'),
      path.join(appPath, 'README.old.md')
    )
  }

  // modifies README.md commands based on user used package manager.
  if (useYarn) {
    try {
      const readme = fs.readFileSync(path.join(appPath, 'README.md'), 'utf8')
      fs.writeFileSync(
        path.join(appPath, 'README.md'),
        readme.replace(/(npm run |npm )/g, 'yarn '),
        'utf8'
      )
    } catch (err) {
      // Silencing the error. As it fall backs to using default npm commands.
    }
  }

  const gitignoreExists = fs.existsSync(path.join(appPath, '.gitignore'))
  if (gitignoreExists) {
    // Append if there's already a `.gitignore` file there
    const data = fs.readFileSync(path.join(appPath, 'gitignore'))
    fs.appendFileSync(path.join(appPath, '.gitignore'), data)
    fs.unlinkSync(path.join(appPath, 'gitignore'))
  } else {
    // Rename gitignore after the fact to prevent npm from renaming it to .npmignore
    // See: https://github.com/npm/npm/issues/1862
    const tempGitIgnorePath = path.join(appPath, 'gitignore')
    if (fs.existsSync(tempGitIgnorePath)) {
      fs.moveSync(
        path.join(appPath, 'gitignore'),
        path.join(appPath, '.gitignore'),
        []
      )
    }
  }

  // Initialize git repo
  let initializedGit = false

  if (tryGitInit()) {
    initializedGit = true
    console.log()
    console.log('Initialized a git repository.')
  }

  let command
  let remove
  let args

  if (useYarn) {
    command = 'yarnpkg'
    remove = 'remove'
    args = ['add']
  } else {
    command = 'npm'
    remove = 'uninstall'
    args = [
      'install',
      '--no-audit', // https://github.com/v3/create-react-app/issues/11174
      '--save',
      verbose && '--verbose'
    ].filter((e) => e)
  }

  // Install additional template dependencies, if present.
  const dependenciesToInstall = Object.entries({
    ...templatePackage.dependencies,
    ...templatePackage.devDependencies
  })
  if (dependenciesToInstall.length) {
    args = args.concat(
      dependenciesToInstall.map(([dependency, version]) => {
        return `${dependency}@${version}`
      })
    )
  }

  // Install react and react-dom for backward compatibility with old CRA cli
  // which doesn't install react and react-dom along with react-v3-scripts
  if (!isReactInstalled(appPackage)) {
    args = args.concat(['react', 'react-dom'])
  }
  if (!minimalism) {
    // Install template dependencies, and react and react-dom if missing.
    const sTime = new Date().getTime()
    if ((!isReactInstalled(appPackage) || templateName) && args.length > 1) {
      console.log()
      console.log(`Installing template dependencies using ${command}...`)

      const proc = spawn.sync(command, args, { stdio: 'inherit' })
      if (proc.status !== 0) {
        console.error(`\`${command} ${args.join(' ')}\` failed`)
        return
      }
    }
    console.log('模板依赖更新完成, 耗时：' + (new Date().getTime() - sTime))
  }

  if (args.find((arg) => arg.includes('typescript'))) {
    console.log()
    verifyTypeScriptSetup()
  }

  if (!minimalism) {
    // Remove template
    console.log(`Removing template package using ${command}...`)
    console.log()

    const proc = spawn.sync(command, [remove, templateName], {
      stdio: 'inherit'
    })
    if (proc.status !== 0) {
      console.error(`\`${command} ${args.join(' ')}\` failed`)
      return
    }
  }

  //有需求再开放，当前验证报错
  // Create git commit if git repo was initialized
  if (false && initializedGit && tryGitCommit(appPath)) {
    console.log()
    console.log('Created git commit.')
  }

  // Display the most elegant way to cd.
  // This needs to handle an undefined originalDirectory for
  // backward compatibility with old global-cli's.
  let cdpath
  if (originalDirectory && path.join(originalDirectory, appName) === appPath) {
    cdpath = appName
  } else {
    cdpath = appPath
  }

  // Change displayed command to yarn instead of yarnpkg
  console.log()
  console.log(`成功! 成功创建 ${appName} ，路径： ${appPath}`)
  console.log('在该目录下，您可以执行以下命令:')
  console.log()
  displayCommand(useYarn, 'vact:start', '启动开发环境。')
  displayCommand(useYarn, 'vact:publish', '部署构件到VTeam。')
  displayCommand(useYarn, 'vact:test', '运行自动化测试脚本。')
  displayCommand(useYarn, 'vact:install', '从VTeam中安装VAct组件。')
  displayCommand(useYarn, 'vact:clear', '清除缓存信息。')
  displayCommand(useYarn, 'vact:pack', '打包成应用服务构件。')
  console.log()
  console.log('建议按照以下步骤开始开发：')
  console.log()
  console.log(chalk.cyan('  cd'), cdpath)
  console.log(`  ${chalk.cyan(getRunCommand(useYarn, 'vact:start'))}`)
  if (readmeExists) {
    console.log()
    console.log(
      chalk.yellow(
        'You had a `README.md` file, we renamed it to `README.old.md`'
      )
    )
  }
  console.log()
  console.log('Happy hacking!')
}

function getRunCommand(useYarn, command) {
  const displayedCommand = useYarn ? 'yarn' : 'npm'
  return `  ${displayedCommand} ${useYarn ? '' : 'run '} ${command}`
}

function displayCommand(useYarn, command, desc) {
  console.log(chalk.cyan(getRunCommand(useYarn, command)))
  console.log(`    ${desc}`)
  console.log()
}

function isReactInstalled(appPackage) {
  const dependencies = appPackage.dependencies || {}

  return (
    typeof dependencies.react !== 'undefined' &&
    typeof dependencies['react-dom'] !== 'undefined'
  )
}
