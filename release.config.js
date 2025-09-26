/**
 * 发布配置文件
 *
 * 用于配置一键发布脚本的默认行为
 */

module.exports = {
  // 默认的 git remote 名称
  // 优先级: 1. 命令行参数 2. 此配置 3. 自动检测
  defaultRemote: 'github-open-sdk-js',

  // 默认的发布分支
  defaultBranch: 'master',

  // 是否在发布前自动运行测试
  runTestsBeforeRelease: true,

  // 是否在发布前自动运行构建
  runBuildBeforeRelease: true,

  // 是否自动检查工作目录状态
  checkWorkingDirectory: true,

  // 工作流等待超时时间（分钟）
  workflowTimeout: 10,

  // 是否自动合并 Release Please PR
  autoMergeReleasePR: false,

  // 发布后验证配置
  verification: {
    // 是否验证 NPM 包发布
    checkNpmPackage: true,

    // 是否验证 GitHub Release
    checkGithubRelease: true,

    // 验证超时时间（分钟）
    timeout: 5,
  },

  // 提交信息模板
  commitMessageTemplate: {
    patch: 'fix: release version {newVersion}',
    minor: 'feat: release version {newVersion}',
    major: 'feat!: release version {newVersion}',
  },

  // 自定义钩子函数
  hooks: {
    // 发布前钩子
    beforeRelease: null,

    // 版本更新后钩子
    afterVersionUpdate: null,

    // 推送前钩子
    beforePush: null,

    // 发布完成后钩子
    afterRelease: null,
  },

  // 发布通知配置
  notifications: {
    // 是否显示成功通知
    showSuccess: true,

    // 是否显示相关链接
    showLinks: true,

    // 自定义通知函数
    customNotifier: null,
  },
};
