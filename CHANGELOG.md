# Changelog

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
