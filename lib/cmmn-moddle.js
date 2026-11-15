import {
  isString,
  assign
} from 'min-dash';

import { Moddle } from 'moddle';

import {
  Reader,
  Writer
} from 'moddle-xml';

import {
  getGenericType,
  isExtensionTypeName
} from './extensions.js';


/**
 * A sub class of {@link Moddle} with support for import and export of CMMN 1.1 xml files.
 *
 * Elements of an extension package without a type are kept as generic
 * elements (see ./extensions.js).
 *
 * @class CmmnModdle
 * @extends Moddle
 *
 * @param {Object|Array} packages to use for instantiating the model
 * @param {Object} [options] additional options to pass over
 */
export default function CmmnModdle(packages, options) {
  Moddle.call(this, packages, options);
}

CmmnModdle.prototype = Object.create(Moddle.prototype);


/**
 * Return the type with the given name. While reading, an unknown type of an
 * extension package is returned as a generic element type, so the element
 * is kept.
 *
 * @param {String|Object} descriptor
 *
 * @return {Function}
 */
CmmnModdle.prototype.getType = function(descriptor) {

  try {
    return Moddle.prototype.getType.call(this, descriptor);
  } catch (err) {

    if (this._reading && isExtensionTypeName(this, descriptor)) {
      return getGenericType();
    }

    throw err;
  }
};

/**
 * The fromXML result.
 *
 * @typedef {Object} ParseResult
 *
 * @property {ModdleElement} rootElement
 * @property {Array<Object>} references
 * @property {Array<Error>} warnings
 * @property {Object} elementsById - a mapping containing each ID -> ModdleElement
 */

/**
 * The fromXML error.
 *
 * @typedef {Error} ParseError
 *
 * @property {Array<Error>} warnings
 */

/**
 * Instantiates a CMMN model tree from a given xml string.
 *
 * @param {String}   xmlStr
 * @param {String}   [typeName='cmmn:Definitions'] name of the root element
 * @param {Object}   [options]  options to pass to the underlying reader
 *
 * @return {Promise<ParseResult, ParseError>}
 */
CmmnModdle.prototype.fromXML = function(xmlStr, typeName, options) {

  if (!isString(typeName)) {
    options = typeName;
    typeName = 'cmmn:Definitions';
  }

  var reader = new Reader(assign({ model: this, lax: true }, options));
  var rootHandler = reader.handler(typeName);

  // the reader parses synchronously when fromXML is called and resolves
  // the references before the returned promise settles
  this._reading = true;

  try {
    return reader.fromXML(xmlStr, rootHandler);
  } finally {
    this._reading = false;
  }
};


/**
 * The toXML result.
 *
 * @typedef {Object} SerializationResult
 *
 * @property {String} xml
 */

/**
 * Serializes a CMMN 1.1 object tree to XML.
 *
 * @param {String}   element    the root element, typically an instance of `cmmn:Definitions`
 * @param {Object}   [options]  to pass to the underlying writer
 *
 * @return {Promise<SerializationResult, Error>}
 */
CmmnModdle.prototype.toXML = function(element, options) {

  var writer = new Writer(options);

  return new Promise(function(resolve, reject) {
    try {
      var result = writer.toXML(element);

      return resolve({
        xml: result
      });
    } catch (err) {
      return reject(err);
    }
  });
};
