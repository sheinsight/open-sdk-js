# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.1.0](https://github.com/sheinsight/open-sdk-js/compare/open-sdk-js-v1.0.1...open-sdk-js-v1.1.0) (2025-09-23)


### Features

* add release-please configuration for automated NPM publishing ([b556cf6](https://github.com/sheinsight/open-sdk-js/commit/b556cf68082e6362d6148084669be60d29a43c3a))
* init ([b0dc18d](https://github.com/sheinsight/open-sdk-js/commit/b0dc18d83b21bee7a92eda481ef30e2e15aab9d2))
* upgrade minimum Node.js requirement to 20+ for latest dependencies ([5e959f5](https://github.com/sheinsight/open-sdk-js/commit/5e959f5a6c6e816e33e0f5668333185c730a3207))
* upgrade Node.js requirement to 18+ and update dependencies ([5bf5dc7](https://github.com/sheinsight/open-sdk-js/commit/5bf5dc763e70ec11f019fa93ba1e58853e1ca5cc))
* 优化项目打包，支持tree-shaking ([3754ef2](https://github.com/sheinsight/open-sdk-js/commit/3754ef27367663bc80414cc7e041bfda821479fe))
* 更新README ([90b9cd0](https://github.com/sheinsight/open-sdk-js/commit/90b9cd07c69bd1382d500696b980dcbaef7efa57))
* 更新README ([f1879f6](https://github.com/sheinsight/open-sdk-js/commit/f1879f614475880288fdc63ca2a2b9d220905a79))
* 更新README ([deebd7e](https://github.com/sheinsight/open-sdk-js/commit/deebd7e8a8da60ca3c8f7ed59f98205aabc4290d))
* 更新README ([014d731](https://github.com/sheinsight/open-sdk-js/commit/014d7311d9ea13b6ff5587ab20a246846336afe1))
* 更新发布信息 ([b6c1004](https://github.com/sheinsight/open-sdk-js/commit/b6c1004af454e9d6a83ae160aec0a9422598112f))


### Bug Fixes

* add checkout step before release-please action ([b05588e](https://github.com/sheinsight/open-sdk-js/commit/b05588e4ee68a15dbdfff38ffd538e3a4ce03b37))
* adjust test coverage thresholds to 70% for reliable CI ([f384117](https://github.com/sheinsight/open-sdk-js/commit/f384117a5c6e6c647dc46fd0f785f12e557e5cd8))
* correct demo script name in CI workflow ([1da1b22](https://github.com/sheinsight/open-sdk-js/commit/1da1b22c5a17a80565ba82753027bbbcf50280df))
* downgrade rimraf to support Node 16+ and fix workflow configs ([d0fbdcc](https://github.com/sheinsight/open-sdk-js/commit/d0fbdccb9e2d69f2d0b70839801b0ee2bb2f8f85))
* update CI workflow to use latest GitHub Actions ([1c85ad8](https://github.com/sheinsight/open-sdk-js/commit/1c85ad8187e33538aeeb0cec30f6085c88f55211))
* update release-please action and remove deprecated package-name parameter ([bc9a598](https://github.com/sheinsight/open-sdk-js/commit/bc9a598a32beb3976d010948ca4c0a956e31b7e0))
* update workflows to use master branch instead of main ([394c5cb](https://github.com/sheinsight/open-sdk-js/commit/394c5cbaf804250a60c5c0c685d8bcd3a1a1b4d6))


### Miscellaneous

* bump version to 1.0.2 for npm publish ([73d086e](https://github.com/sheinsight/open-sdk-js/commit/73d086ed212bd023244c8ee7801821b1145f844c))

## [1.0.0] - 2025-09-18

### Added

- Initial release of Shein Open SDK
- HMAC-SHA256 signature generation algorithm implementation
- TypeScript support with comprehensive type definitions
- Multi-platform support (Node.js, Browser, UMD)
- Comprehensive input validation
- 100% test coverage
- Multiple module formats (CommonJS, ES Module, UMD)
- Rich examples and documentation
- GitHub Actions CI/CD pipeline
- Automated release management with release-please
- pnpm package manager support

### Features

- Interactive browser demo
- Node.js and TypeScript usage examples

### Security

- Secure HMAC-SHA256 implementation using crypto-js
- Input validation to prevent injection attacks
- No sensitive data logging or exposure
