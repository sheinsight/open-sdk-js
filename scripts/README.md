# 一键发布脚本

这是一个功能完整的自动化发布脚本，支持交互式配置和灵活的发布选项。

## 🚀 快速开始

### 基本用法

```bash
# 交互式发布（推荐新手使用）
npm run release

# 快速发布补丁版本
npm run release:patch

# 快速发布次要版本
npm run release:minor

# 快速发布主要版本
npm run release:major
```

### 高级用法

```bash
# 指定 git remote
npm run release -- --remote=origin

# 指定发布类型和 remote
npm run release -- --type=minor --remote=github-open-sdk-js

# 显示帮助信息
npm run release -- --help
```

## 📋 功能特性

### ✅ 核心功能

- **交互式版本选择** - 直观的版本类型选择界面
- **自动版本计算** - 根据当前版本自动计算新版本号
- **智能 Remote 检测** - 自动检测并使用合适的 git remote
- **工作目录检查** - 确保代码库状态干净
- **符合规范的提交** - 生成符合 Conventional Commits 的提交信息

### ✅ 自动化流程

- **Release Please 集成** - 自动触发 Release Please 工作流
- **工作流监控** - 实时监控 GitHub Actions 执行状态
- **PR 自动处理** - 可选的自动合并 Release Please PR
- **发布验证** - 自动验证 NPM 包和 GitHub Release

### ✅ 用户体验

- **彩色输出** - 清晰的日志和状态显示
- **进度提示** - 详细的执行步骤说明
- **错误处理** - 友好的错误信息和恢复建议
- **中断处理** - 支持 Ctrl+C 安全退出

## 📖 详细说明

### 版本类型

| 类型 | 说明 | 示例 | 用途 |
|------|------|------|------|
| `patch` | 补丁版本 | 1.0.0 → 1.0.1 | Bug 修复、小改进 |
| `minor` | 次要版本 | 1.0.0 → 1.1.0 | 新功能、向后兼容 |
| `major` | 主要版本 | 1.0.0 → 2.0.0 | 破坏性变更、大版本升级 |

### Remote 配置

脚本会按以下优先级选择 git remote：

1. **命令行参数** - `--remote=<name>`
2. **配置文件** - `release.config.js` 中的 `defaultRemote`
3. **自动检测** - 按优先级：`github-open-sdk-js` > `origin` > 第一个可用

### 执行流程

1. **环境检查** - 验证 Git 仓库、package.json 等
2. **状态检查** - 检查工作目录是否干净
3. **版本选择** - 交互式选择或命令行指定
4. **确认信息** - 显示发布详情供用户确认
5. **更新版本** - 修改 package.json 中的版本号
6. **提交推送** - 创建提交并推送到指定 remote
7. **监控流程** - 等待并监控 Release Please 工作流
8. **处理 PR** - 检查并可选合并 Release Please PR
9. **验证结果** - 验证 NPM 包和 GitHub Release

## ⚙️ 配置选项

创建 `release.config.js` 文件来自定义行为：

```javascript
module.exports = {
  // 默认 remote
  defaultRemote: 'github-open-sdk-js',
  
  // 默认分支
  defaultBranch: 'master',
  
  // 是否自动合并 Release Please PR
  autoMergeReleasePR: false,
  
  // 工作流等待超时（分钟）
  workflowTimeout: 10,
  
  // 验证配置
  verification: {
    checkNpmPackage: true,
    checkGithubRelease: true,
    timeout: 5
  }
};
```

## 🛠️ 前置要求

### 必需工具

- **Node.js** >= 16.0.0
- **Git** - 版本控制
- **npm/yarn/pnpm** - 包管理器

### 可选工具

- **GitHub CLI (gh)** - 用于监控工作流和处理 PR
  ```bash
  # macOS
  brew install gh
  
  # 其他系统
  # 参考: https://cli.github.com/manual/installation
  ```

### 环境配置

1. **GitHub Secrets** - 确保已配置 NPM 发布 token
2. **Release Please** - 确保仓库已配置 Release Please 工作流
3. **权限配置** - 确保有推送代码和发布包的权限

## 🔧 故障排除

### 常见问题

**Q: 提示 "工作目录有未提交更改"**
```bash
# 查看未提交的更改
git status

# 提交更改或储藏
git add .
git commit -m "your message"
# 或
git stash
```

**Q: 找不到合适的 git remote**
```bash
# 查看现有 remote
git remote -v

# 添加 remote（如果需要）
git remote add github-open-sdk-js https://github.com/user/repo.git
```

**Q: GitHub CLI 未认证**
```bash
# 登录 GitHub CLI
gh auth login
```

**Q: Release Please 工作流失败**
- 检查 GitHub Actions 页面查看详细错误
- 确保 NPM token 配置正确
- 验证 package.json 和 release-please-config.json 配置

### 调试模式

如果遇到问题，可以手动执行各个步骤：

```bash
# 1. 检查状态
git status
git remote -v

# 2. 查看当前版本
npm version

# 3. 检查 GitHub Actions
gh run list --limit 5

# 4. 查看 Release Please PR
gh pr list --label "autorelease: pending"
```

## 📄 示例场景

### 场景 1: 修复 Bug 发布

```bash
# 修复了一个 bug，需要发布补丁版本
npm run release:patch
```

### 场景 2: 添加新功能

```bash
# 添加了新功能，需要发布次要版本
npm run release:minor
```

### 场景 3: 多 Remote 项目

```bash
# 项目有多个 remote，指定发布到特定 remote
npm run release -- --remote=upstream
```

### 场景 4: 自动化 CI/CD

```bash
# 在 CI/CD 中使用，跳过交互式确认
npm run release:patch
```

## 🤝 贡献

如果您发现问题或有改进建议，欢迎：

1. 提交 Issue 描述问题
2. 提交 Pull Request 贡献代码
3. 完善文档和示例

## 📜 许可证

本脚本遵循项目的 MIT 许可证。