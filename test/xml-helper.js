import expect from './expect.js';

import SchemaValidator from 'xsd-schema-validator';

import {
  readFile
} from './helper.js';

var CMMN_XSD = 'resources/cmmn/xsd/CMMN11.xsd';


export function fromFile(moddle, file) {
  var fileContents = readFile(file);

  return moddle.fromXML(fileContents, 'cmmn:Definitions');
}


export function toXML(element, opts) {
  return element.$model.toXML(element, opts);
}


export function validate(xml) {

  if (!xml) {
    return Promise.reject(new Error('XML is not defined'));
  }

  return new Promise(function(resolve, reject) {

    SchemaValidator.validateXML(xml, CMMN_XSD, function(err, result) {

      if (err) {
        return reject(err);
      }

      expect(result.valid).to.be.true;

      resolve();
    });
  });
}
