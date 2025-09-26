#!/usr/bin/env node

/* eslint-env node */
/* eslint-disable no-undef */

/**
 * 一键发布脚本
 *
 * 功能:
 * - 交互式选择发布版本类型 (patch/minor/major)
 * - 支持指定 git remote 或使用默认 remote
 * - 自动触发 Release Please 工作流
 * - 监控发布过程并验证结果
 *
 * 使用方法:
 * npm run release                    # 使用默认 remote
 * npm run release -- --remote=origin  # 指定 remote
 * npm run release -- --help         # 显示帮助
 */

const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

// 颜色输出工具
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

const log = {
  info: msg => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: msg => console.log(`${colors.green}✅${colors.reset} ${msg}`),
  warn: msg => console.log(`${colors.yellow}⚠️${colors.reset} ${msg}`),
  error: msg => console.log(`${colors.red}❌${colors.reset} ${msg}`),
  step: msg => console.log(`${colors.cyan}🔄${colors.reset} ${msg}`),
  title: msg => console.log(`\n${colors.bold}${colors.magenta}📦 ${msg}${colors.reset}\n`),
};

// 创建交互式输入接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// 提示用户输入
const question = prompt => {
  return new Promise(resolve => {
    rl.question(prompt, resolve);
  });
};

// 执行命令并返回结果
const execCommand = (command, options = {}) => {
  try {
    const result = execSync(command, {
      encoding: 'utf8',
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options,
    });
    return result?.toString().trim();
  } catch (error) {
    if (!options.allowFailure) {
      log.error(`命令执行失败: ${command}`);
      log.error(error.message);
      process.exit(1);
    }
    return null;
  }
};

// 检查命令是否可用
const checkCommand = command => {
  try {
    execSync(`which ${command}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
};

// 获取当前包信息
const getPackageInfo = () => {
  const packagePath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(packagePath)) {
    log.error('package.json 文件不存在');
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(packagePath, 'utf8'));
};

// 获取 git remote 列表
const getGitRemotes = () => {
  const result = execCommand('git remote -v', { silent: true });
  const remotes = new Set();

  result.split('\n').forEach(line => {
    const match = line.match(/^([\w-]+)\s+/);
    if (match) {
      remotes.add(match[1]);
    }
  });

  return Array.from(remotes);
};

// 获取默认 remote
const getDefaultRemote = () => {
  const remotes = getGitRemotes();

  // 优先级: github-open-sdk-js > origin > 第一个
  if (remotes.includes('github-open-sdk-js')) return 'github-open-sdk-js';
  if (remotes.includes('origin')) return 'origin';
  return remotes[0] || null;
};

// 检查工作目录状态
const checkWorkingDirectory = () => {
  log.step('检查工作目录状态...');

  const status = execCommand('git status --porcelain', { silent: true });
  if (status) {
    log.warn('工作目录有未提交的更改:');
    console.log(status);
    return false;
  }

  log.success('工作目录干净');
  return true;
};

// 获取当前分支
const getCurrentBranch = () => {
  return execCommand('git branch --show-current', { silent: true });
};

// 生成版本更新的提交信息
const generateCommitMessage = (versionType, currentVersion, newVersion) => {
  const typeMap = {
    patch: 'fix',
    minor: 'feat',
    major: 'feat!',
  };

  const prefix = typeMap[versionType] || 'feat';
  return `${prefix}: release version ${newVersion}

- Bump version from ${currentVersion} to ${newVersion}
- Trigger Release Please workflow for automated NPM publishing
- Update package.json version

Type: ${versionType}
Previous: ${currentVersion}
Current: ${newVersion}`;
};

// 更新 package.json 版本
const updatePackageVersion = newVersion => {
  const packagePath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  packageJson.version = newVersion;
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
  log.success(`已更新 package.json 版本到 ${newVersion}`);
};

// 计算新版本号
const calculateNewVersion = (currentVersion, versionType) => {
  const [major, minor, patch] = currentVersion.split('.').map(Number);

  switch (versionType) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    default:
      throw new Error(`不支持的版本类型: ${versionType}`);
  }
};

// 等待 GitHub Actions 工作流
const waitForWorkflow = async (remote, timeoutMinutes = 10) => {
  log.step('等待 Release Please 工作流启动...');

  if (!checkCommand('gh')) {
    log.warn('GitHub CLI (gh) 未安装，无法监控工作流状态');
    return;
  }

  // 获取仓库信息
  const remoteUrl = execCommand(`git remote get-url ${remote}`, { silent: true });
  const repoMatch = remoteUrl.match(/github\.com[:/]([^/]+\/[^/.]+)/);

  if (!repoMatch) {
    log.warn('无法解析 GitHub 仓库信息，跳过工作流监控');
    return;
  }

  const repo = repoMatch[1].replace('.git', '');
  log.info(`监控仓库: ${repo}`);

  const startTime = Date.now();
  const timeout = timeoutMinutes * 60 * 1000;

  while (Date.now() - startTime < timeout) {
    try {
      const runs = execCommand(`gh run list --repo ${repo} --limit 3 --json status,conclusion,workflowName,createdAt`, { silent: true, allowFailure: true });

      if (runs) {
        const runData = JSON.parse(runs);
        const releaseRuns = runData.filter(run => run.workflowName === 'Release Please');

        if (releaseRuns.length > 0) {
          const latestRun = releaseRuns[0];
          log.info(`Release Please 状态: ${latestRun.status}`);

          if (latestRun.status === 'completed') {
            if (latestRun.conclusion === 'success') {
              log.success('Release Please 工作流执行成功');
              return true;
            } else {
              log.error(`Release Please 工作流失败: ${latestRun.conclusion}`);
              return false;
            }
          }
        }
      }
    } catch {
      // 忽略错误，继续等待
    }

    await new Promise(resolve => setTimeout(resolve, 10000)); // 等待10秒
  }

  log.warn(`等待超时 (${timeoutMinutes} 分钟)，请手动检查工作流状态`);
  return null;
};

// 检查 Release Please PR
const checkReleasePR = async remote => {
  if (!checkCommand('gh')) {
    log.warn('GitHub CLI (gh) 未安装，无法检查 PR 状态');
    return;
  }

  try {
    const remoteUrl = execCommand(`git remote get-url ${remote}`, { silent: true });
    const repoMatch = remoteUrl.match(/github\.com[:/]([^/]+\/[^/.]+)/);

    if (!repoMatch) {
      log.warn('无法解析 GitHub 仓库信息');
      return;
    }

    const repo = repoMatch[1].replace('.git', '');
    const prs = execCommand(`gh pr list --repo ${repo} --label "autorelease: pending" --json number,title,url`, { silent: true, allowFailure: true });

    if (prs) {
      const prData = JSON.parse(prs);
      if (prData.length > 0) {
        const pr = prData[0];
        log.success(`发现 Release Please PR: #${pr.number}`);
        log.info(`标题: ${pr.title}`);
        log.info(`链接: ${pr.url}`);

        const shouldMerge = await question('是否自动合并此 PR 以触发发布? (y/N): ');
        if (shouldMerge.toLowerCase() === 'y' || shouldMerge.toLowerCase() === 'yes') {
          log.step('正在合并 Release Please PR...');
          execCommand(`gh pr merge ${pr.number} --repo ${repo} --merge`);
          log.success('PR 已合并，Release 流程已触发');

          // 等待发布完成
          await waitForWorkflow(remote, 15);
        }
      } else {
        log.info('暂无 Release Please PR，可能需要等待或检查提交是否符合 conventional commits 规范');
      }
    }
  } catch (error) {
    log.warn('检查 PR 状态时出错:', error.message);
  }
};

// 验证发布结果
const verifyRelease = async (packageName, expectedVersion) => {
  log.step('验证发布结果...');

  try {
    // 检查 NPM 包
    const npmVersion = execCommand(`npm view ${packageName} version --silent`, { silent: true, allowFailure: true });

    if (npmVersion === expectedVersion) {
      log.success(`NPM 包 ${packageName}@${expectedVersion} 发布成功`);
    } else if (npmVersion) {
      log.warn(`NPM 包当前版本: ${npmVersion}, 期望版本: ${expectedVersion}`);
    } else {
      log.warn('无法获取 NPM 包版本信息');
    }

    // 检查 GitHub Release
    if (checkCommand('gh')) {
      const releases = execCommand('gh release list --limit 1 --json tagName', { silent: true, allowFailure: true });

      if (releases) {
        const releaseData = JSON.parse(releases);
        if (releaseData.length > 0) {
          log.success(`GitHub Release 已创建: ${releaseData[0].tagName}`);
        }
      }
    }
  } catch (error) {
    log.warn('验证发布结果时出错:', error.message);
  }
};

// 显示帮助信息
const showHelp = () => {
  console.log(`
${colors.bold}📦 一键发布脚本${colors.reset}

${colors.bold}用法:${colors.reset}
  npm run release                        # 交互式发布
  npm run release -- --remote=origin    # 指定 remote
  npm run release -- --type=patch       # 指定发布类型
  npm run release:patch                  # 快速补丁发布
  npm run release:minor                  # 快速次要版本发布  
  npm run release:major                  # 快速主要版本发布
  npm run release -- --help             # 显示帮助信息

${colors.bold}参数:${colors.reset}
  --remote=<name>    指定 git remote 名称 (默认: github-open-sdk-js 或 origin)
  --type=<type>      指定发布类型 (patch/minor/major)
  --help            显示帮助信息

${colors.bold}快捷命令:${colors.reset}
  npm run release:patch    等同于 npm run release -- --type=patch
  npm run release:minor    等同于 npm run release -- --type=minor
  npm run release:major    等同于 npm run release -- --type=major

${colors.bold}功能:${colors.reset}
  ✅ 交互式选择发布版本类型 (patch/minor/major)
  ✅ 自动更新 package.json 版本号
  ✅ 生成符合 conventional commits 的提交信息
  ✅ 推送到指定 remote 触发 Release Please
  ✅ 监控工作流执行状态
  ✅ 自动检查和合并 Release Please PR
  ✅ 验证最终发布结果

${colors.bold}版本类型说明:${colors.reset}
  patch  修复版本 (1.0.0 → 1.0.1) - 向后兼容的bug修复
  minor  次要版本 (1.0.0 → 1.1.0) - 向后兼容的新功能  
  major  主要版本 (1.0.0 → 2.0.0) - 不向后兼容的变更

${colors.bold}注意事项:${colors.reset}
  • 确保工作目录没有未提交的更改
  • 确保已正确配置 GitHub CLI (gh)
  • 确保 remote 仓库有 Release Please 工作流
  • 确保有正确的 NPM 发布权限
`);
};

// 主函数
const main = async () => {
  try {
    log.title('一键发布脚本');

    // 解析命令行参数
    const args = process.argv.slice(2);
    const remoteArg = args.find(arg => arg.startsWith('--remote='));
    const typeArg = args.find(arg => arg.startsWith('--type='));
    const helpArg = args.includes('--help');

    if (helpArg) {
      showHelp();
      process.exit(0);
    }

    // 基础检查
    log.step('执行环境检查...');

    if (!fs.existsSync('.git')) {
      log.error('当前目录不是 Git 仓库');
      process.exit(1);
    }

    const packageInfo = getPackageInfo();
    log.success(`当前包: ${packageInfo.name}@${packageInfo.version}`);

    // 检查工作目录
    if (!checkWorkingDirectory()) {
      const shouldContinue = await question('工作目录有未提交更改，是否继续? (y/N): ');
      if (shouldContinue.toLowerCase() !== 'y' && shouldContinue.toLowerCase() !== 'yes') {
        log.info('操作已取消');
        process.exit(0);
      }
    }

    // 获取 remote
    let targetRemote = remoteArg ? remoteArg.split('=')[1] : null;

    if (!targetRemote) {
      targetRemote = getDefaultRemote();
      if (!targetRemote) {
        log.error('没有找到可用的 git remote');
        process.exit(1);
      }
    }

    const remotes = getGitRemotes();
    if (!remotes.includes(targetRemote)) {
      log.error(`Remote '${targetRemote}' 不存在`);
      log.info(`可用的 remotes: ${remotes.join(', ')}`);
      process.exit(1);
    }

    log.success(`使用 remote: ${targetRemote}`);

    // 获取当前分支
    const currentBranch = getCurrentBranch();
    log.info(`当前分支: ${currentBranch}`);

    // 确定发布类型
    let versionType = typeArg ? typeArg.split('=')[1] : null;

    if (versionType) {
      // 验证命令行参数中的版本类型
      const validTypes = ['patch', 'minor', 'major'];
      if (!validTypes.includes(versionType)) {
        log.error(`无效的版本类型: ${versionType}`);
        log.info(`支持的类型: ${validTypes.join(', ')}`);
        process.exit(1);
      }
      log.info(`使用指定的发布类型: ${versionType}`);
    } else {
      // 交互式选择发布类型
      console.log(`\n${colors.bold}选择发布类型:${colors.reset}`);
      console.log(`  1. patch  - 修复版本 (${packageInfo.version} → ${calculateNewVersion(packageInfo.version, 'patch')})`);
      console.log(`  2. minor  - 次要版本 (${packageInfo.version} → ${calculateNewVersion(packageInfo.version, 'minor')})`);
      console.log(`  3. major  - 主要版本 (${packageInfo.version} → ${calculateNewVersion(packageInfo.version, 'major')})`);

      const versionChoice = await question('\n请选择发布类型 (1-3): ');

      const versionTypes = ['patch', 'minor', 'major'];
      versionType = versionTypes[parseInt(versionChoice) - 1];

      if (!versionType) {
        log.error('无效的选择');
        process.exit(1);
      }
    }

    const newVersion = calculateNewVersion(packageInfo.version, versionType);

    console.log(`\n${colors.bold}发布信息确认:${colors.reset}`);
    console.log(`  包名: ${packageInfo.name}`);
    console.log(`  当前版本: ${packageInfo.version}`);
    console.log(`  新版本: ${newVersion}`);
    console.log(`  发布类型: ${versionType}`);
    console.log(`  目标 remote: ${targetRemote}`);
    console.log(`  当前分支: ${currentBranch}`);

    const shouldProceed = await question('\n确认发布? (y/N): ');
    if (shouldProceed.toLowerCase() !== 'y' && shouldProceed.toLowerCase() !== 'yes') {
      log.info('操作已取消');
      process.exit(0);
    }

    // 开始发布流程
    log.step('开始发布流程...');

    // 1. 更新版本号
    updatePackageVersion(newVersion);

    // 2. 提交更改
    const commitMessage = generateCommitMessage(versionType, packageInfo.version, newVersion);
    log.step('提交版本更新...');
    execCommand('git add package.json');
    execCommand(`git commit -m "${commitMessage}"`);
    log.success('版本更新已提交');

    // 3. 推送到远程
    log.step(`推送到 ${targetRemote}/${currentBranch}...`);
    execCommand(`git push ${targetRemote} ${currentBranch}`);
    log.success('代码已推送到远程仓库');

    // 4. 等待并监控工作流
    const workflowResult = await waitForWorkflow(targetRemote);

    if (workflowResult === true) {
      // 5. 检查 Release Please PR
      await checkReleasePR(targetRemote);

      // 6. 验证发布结果
      await verifyRelease(packageInfo.name, newVersion);
    }

    log.title('发布流程完成');
    log.success('请检查 GitHub Actions 和 NPM 包发布状态');

    if (checkCommand('gh')) {
      const remoteUrl = execCommand(`git remote get-url ${targetRemote}`, { silent: true });
      const repoMatch = remoteUrl.match(/github\.com[:/]([^/]+\/[^/.]+)/);
      if (repoMatch) {
        const repo = repoMatch[1].replace('.git', '');
        console.log(`\n${colors.bold}相关链接:${colors.reset}`);
        console.log(`  GitHub Actions: https://github.com/${repo}/actions`);
        console.log(`  NPM 包页面: https://www.npmjs.com/package/${packageInfo.name}`);
      }
    }
  } catch (error) {
    log.error('发布过程中出现错误:');
    log.error(error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
};

// 处理 Ctrl+C
process.on('SIGINT', () => {
  console.log('\n\n❌ 操作已取消');
  rl.close();
  process.exit(0);
});

// 启动主函数
main();
