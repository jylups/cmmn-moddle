# Changelog

All notable changes to [@jylups/cmmn-moddle](https://github.com/jylups/cmmn-moddle) are documented here. We use [semantic versioning](http://semver.org/) for releases. Versions up to `5.0.0` were published as [cmmn-moddle](https://github.com/bpmn-io/cmmn-moddle) by bpmn.io.

## Unreleased

___Note:__ Yet to be released changes appear here._

## 6.1.1

* `FIX`: read attributes with white space around their `=` (`name ="value"`, `name= "value"`), which XML allows; the element was reported as unparsable and its attributes were lost ([jylups/cmmn-js-env#43](https://github.com/jylups/cmmn-js-env/issues/43))

## 6.1.0

* `FEAT`: keep elements of an extension package that have no type in it, such as custom `flowable:*` extension elements, as generic elements with their attributes, text and children, instead of dropping them; unknown elements of the CMMN 1.1 packages are still reported and dropped ([jylups/cmmn-js-env#16](https://github.com/jylups/cmmn-js-env/issues/16))

## 6.0.0

* `CHORE`: publish from GitHub releases with npm trusted publishing instead of a stored npm token
* `CHORE`: publish prerelease versions under the `next` dist-tag
* `FEAT`: make `fromXML` and `toXML` Promise based
* `FEAT`: publish an ES module that plain Node 20.12 or later can import (or `require`), with an `exports` field
* `DEPS`: update to `moddle@8`, `moddle-xml@12` and `min-dash@5`
* `CHORE`: build `dist/index.js` with Rollup, and run the tests on it with mocha 11 instead of `@babel/register`
* `FIX`: read and write `standardEvent` of `cmmn:PlanItemStartTrigger` and `cmmn:CaseFileItemStartTrigger` as a child element, as CMMN 1.1 defines it ([jylups/cmmn-js-env#18](https://github.com/jylups/cmmn-js-env/issues/18))

### Breaking Changes

* `CmmnModdle#fromXML` and `#toXML` return Promises; they no longer take a callback. `fromXML` resolves with `{ rootElement, references, warnings, elementsById }`, and an error it rejects with has the `warnings` collected so far. `toXML` resolves with `{ xml }`.
* The package is an ES module (`"type": "module"`). Its `exports` field allows the main entry, `resources/*` and `package.json`; other deep imports such as `lib/*` are no longer possible.
* moddle 8 and moddle-xml 12 are ES modules only; consume them, and this package, from Node 20.12 or later or through a bundler.

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