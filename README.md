[![npm version](https://badge.fury.io/js/%40fenril058%2Ftextlint-plugin-org.svg)](https://badge.fury.io/js/%40fenril058%2Ftextlint-plugin-org)
[![Build](https://github.com/fenril058/textlint-plugin-org/actions/workflows/build.yml/badge.svg)](https://github.com/fenril058/textlint-plugin-org/actions/workflows/build.yml)
[![test](https://github.com/fenril058/textlint-plugin-org/actions/workflows/test.yml/badge.svg)](https://github.com/fenril058/textlint-plugin-org/actions/workflows/test.yml)
[![lint](https://github.com/fenril058/textlint-plugin-org/actions/workflows/lint.yml/badge.svg)](https://github.com/fenril058/textlint-plugin-org/actions/workflows/lint.yml)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

# @fenril058/textlint-plugin-org

A maintained fork of **textlint-plugin-org** with support for **orga v4** and modernized tooling.

Add Org mode support for [textlint](https://github.com/textlint/textlint "textlint").

What is textlint plugin? Please see https://github.com/textlint/textlint/blob/master/docs/plugin.md

## Try run by Docker

```shell
docker run -v "$(pwd)":/work \
           --rm -it ghcr.io/fenril058/textlint-plugin-org \
           textlint \
           --plugin org \
           --rule textlint-rule-preset-ja-technical-writing \
           *.org
```

## Install

```sh
npm install @fenril058/textlint-plugin-org
```

## Usage

Via `.textlintrc`(Recommended)

```json
{
    "plugins": [
        "org"
    ]
}
```

```sh
textlint test.org
```


Via CLI

```sh
$ textlint --plugin org test.org
```

## Test

```sh
pnpm test
```

## Lint

```sh
pnpm run lint
```

## Release

```sh
pnpm version patch
git push origin main --follow-tags
pnpm publish
```
