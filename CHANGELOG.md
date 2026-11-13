# Changelog

All notable changes to [@jylups/cmmn-moddle](https://github.com/jylups/cmmn-moddle) are documented here. We use [semantic versioning](http://semver.org/) for releases. Versions up to `5.0.0` were published as [cmmn-moddle](https://github.com/bpmn-io/cmmn-moddle) by bpmn.io.

## Unreleased

___Note:__ Yet to be released changes appear here._

## 5.1.0

* `CHORE`: publish as `@jylups/cmmn-moddle`, a maintained fork of `cmmn-moddle`
* `CHORE`: run the tests on current Node with `@babel/register` instead of `esm`
* `CHORE`: build on GitHub Actions and publish to npm from GitHub releases

## 5.0.0

### Breaking Changes

* `FEAT`: migrate to ES modules. Use `esm` or a ES module aware transpiler to consume this library.

## 4.0.0

* `FEAT`: encode entities in body properties (rather than using CDATA escaping)

## 3.0.0

* `FIX`: properly decode `text` entities
* `CHORE`: improve error handling on invalid attributes
* `CHORE`: drop lodash in favor of [min-dash](https://github.com/bpmn-io/min-dash)

## ...

Check `git log` for earlier history.