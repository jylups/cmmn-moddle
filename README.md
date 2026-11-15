# @jylups/cmmn-moddle

[![CI](https://github.com/jylups/cmmn-moddle/actions/workflows/ci.yml/badge.svg)](https://github.com/jylups/cmmn-moddle/actions/workflows/ci.yml)

> Maintained fork of [bpmn-io/cmmn-moddle](https://github.com/bpmn-io/cmmn-moddle), which is no longer developed, for the [Flowable CMMN editor](https://github.com/jylups/cmmn-js-env). It is published as `@jylups/cmmn-moddle` from version `5.1.0`.

> This library is an [ES module](https://nodejs.org/api/esm.html). Import it in Node 20.12 or later (`require` works too), or bundle it for the browser with an ES module aware bundler such as [Webpack](https://webpack.js.org) or [Rollup](https://rollupjs.org).

Read and write CMMN 1.1 diagram files in NodeJS and the browser.

__cmmn-moddle__ uses the [CMMN 1.1 meta-model](http://www.omg.org/spec/CMMN/) to validate the input and produce correct CMMN 1.1 XML. The library is built on top of [moddle](https://github.com/bpmn-io/moddle) and [moddle-xml](https://github.com/bpmn-io/moddle-xml).


## Usage

Get the library via the [npm package](https://www.npmjs.com/package/@jylups/cmmn-moddle):

```bash
npm install @jylups/cmmn-moddle
```

```javascript
import CmmnModdle from '@jylups/cmmn-moddle';

var moddle = new CmmnModdle();

var xmlStr =
  '<?xml version="1.0" encoding="UTF-8"?>' +
  '<cmmn:definitions xmlns:cmmn="http://www.omg.org/spec/CMMN/20150516/MODEL" id="empty-definitions" targetNamespace="http://bpmn.io/schema/cmmn">' +
  '</cmmn:definitions>';


var {
  rootElement: definitions,
  warnings
} = await moddle.fromXML(xmlStr);

if (warnings.length) {
  console.log('import warnings', warnings);
}

// update id attribute
definitions.set('id', 'NEW ID');

// add a case
var cmmnCase = moddle.create('cmmn:Case', { id: 'MyCase_1' });
definitions.get('cases').push(cmmnCase);

var {
  xml: xmlStrUpdated
} = await moddle.toXML(definitions);

// xmlStrUpdated contains the new id and the added case
```


`fromXML` and `toXML` return Promises. `fromXML` resolves with `{ rootElement, references, warnings, elementsById }`, and an error it rejects with carries the `warnings` collected so far. Version `6.0.0` replaced the callbacks of earlier versions.


### Extension packages

Pass extension packages, such as [Flowable's](https://github.com/jylups/flowable-cmmn-moddle), to the constructor: `new CmmnModdle({ flowable: flowableDescriptor })`. An element of an extension package that has no type in it, for example a custom `flowable:*` extension element, is read as a generic element (`$type`, attributes, `$body`, `$children`) and written back as it was read. Unknown elements of the CMMN 1.1 packages are reported as warnings and dropped.


## Resources

*   [Issues](https://github.com/jylups/cmmn-js-env/issues)
*   [Examples](https://github.com/jylups/cmmn-moddle/tree/master/test/spec/xml)


## Building the Project

To run the test suite that includes XSD schema validation you must have a Java JDK installed and properly exposed through the `JAVA_HOME` variable.

The tests run against the bundle in `dist/`, which `npm test` builds first. Execute the test via

```
npm test
```

Perform a complete build of the library via

```
npm run all
```


## License

Use under the terms of the [MIT license](http://opensource.org/licenses/MIT).
