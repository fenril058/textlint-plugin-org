# Changelog

## [0.5.0](https://github.com/fenril058/textlint-plugin-org/compare/v0.4.4...v0.5.0) (2026-10-22)


### Features

* migrate orga v2 to v4 ([9c8574d](https://github.com/fenril058/textlint-plugin-org/commit/9c8574dc2179063ab255eb8beb0b6ad87290da95))
* prepare for release ([c5366ed](https://github.com/fenril058/textlint-plugin-org/commit/c5366ed80223a0e1bc3f0f3f878a1875a563f7d5))


### Bug Fixes

* add tsconfig.tsbuildinfo to .gitignore ([8f2f123](https://github.com/fenril058/textlint-plugin-org/commit/8f2f123b7526f3df1019948539893deaf53efe7c))
* Dockerfile ([e3e521e](https://github.com/fenril058/textlint-plugin-org/commit/e3e521e37c2c0bd71bc0373c98fc8d27a47a426a))
* flatten orga v4 section nodes into their parent ([1e4a420](https://github.com/fenril058/textlint-plugin-org/commit/1e4a4203c63f111f143253e3a9c46630d18dc800))
* for TypeScript v6 ([67eaa65](https://github.com/fenril058/textlint-plugin-org/commit/67eaa65e884d5b227a5a6365acf2ed761f83c59c))
* move @types/node to devDependencies ([c1f1ea4](https://github.com/fenril058/textlint-plugin-org/commit/c1f1ea42b7e7aa429299081f3bc6cd0a0eec3bab))
* normalize planning timestamp token values ([459987e](https://github.com/fenril058/textlint-plugin-org/commit/459987e1eedd35bbd19a94662acb55f4ed234661))
* normalize planning timestamp token values ([ddfbe44](https://github.com/fenril058/textlint-plugin-org/commit/ddfbe447a04820ff3b06088a9054ceae528c4352))
* remove traverse from dependencies ([57a8881](https://github.com/fenril058/textlint-plugin-org/commit/57a8881178337b0427718227078c861e4794c1ca))
* remove unused dependencies ([95d6541](https://github.com/fenril058/textlint-plugin-org/commit/95d6541cb601a4bbed91222680143e03dc465d72))
* replace traverse.remove() with post-traversal filter for emptyLine/newline nodes ([827b6ee](https://github.com/fenril058/textlint-plugin-org/commit/827b6ee30ce28b18f2359e81745be3fb038fc059))
* resolve conflict ([e8c7ae4](https://github.com/fenril058/textlint-plugin-org/commit/e8c7ae4f12fb7718421747b8353adb29f979ac4a))
* StructuredSource breaking change ([5a0db92](https://github.com/fenril058/textlint-plugin-org/commit/5a0db92512db12e80e26a37792a8240a50c79599))
* suppress linter warnings ([4825563](https://github.com/fenril058/textlint-plugin-org/commit/48255630547d749338c0e7293295d3416004e257))
* TS bump up error `Variable 'AbortSignal' must be of type` ([51b1c1c](https://github.com/fenril058/textlint-plugin-org/commit/51b1c1c7884ca930addeb73f92975a1df6f27c36))
* uninstall @types/date-fns ([0b1e280](https://github.com/fenril058/textlint-plugin-org/commit/0b1e280ddc152fa9cc1f8c76e76e46c359f26cbd))
* update diff and semver ([1068d8e](https://github.com/fenril058/textlint-plugin-org/commit/1068d8e575fa433f50416144d5b5980eec8e44d4))

## [0.4.4](https://github.com/fenril058/textlint-plugin-org/compare/v0.4.3...v0.4.4) (2026-10-22)


### Bug Fixes

* normalize planning timestamp token values while preserving source positions and parsed metadata ([#74](https://github.com/fenril058/textlint-plugin-org/pull/74))

### Dependencies

* update orga from 4.7.1 to 5.0.0 ([#73](https://github.com/fenril058/textlint-plugin-org/pull/73))

Timestamp metadata now uses timezone-free plain data instead of JavaScript `Date` objects.
Timestamp token ranges exclude surrounding whitespace.

## [0.4.3](https://github.com/fenril058/textlint-plugin-org/compare/v0.4.2...v0.4.3) (2026-07-09)


### Bug Fixes

* remove unused dependencies ([95d6541](https://github.com/fenril058/textlint-plugin-org/commit/95d6541cb601a4bbed91222680143e03dc465d72))
