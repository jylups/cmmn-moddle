import { isString } from 'min-dash';

/**
 * Unknown elements of extension packages, such as Flowable's.
 *
 * moddle-xml drops an element of a known package that has no type in it.
 * While reading, an element of an extension package without a type is read
 * as a generic element instead, like an element of an unknown package, so
 * it is kept with its attributes, text and children. Unknown elements of
 * the CMMN 1.1 packages are still reported and dropped.
 */

/**
 * Namespace URIs of the CMMN 1.1 packages: MODEL, CMMNDI, DC and DI.
 */
var CMMN_URI = /^http:\/\/www\.omg\.org\/spec\/CMMN\//;

/**
 * Stands in for the type of an unknown element of an extension package: the
 * reader treats it like an element of an unknown package.
 */
var GENERIC_TYPE = {
  $descriptor: { name: 'Element' },
  hasType: function(type) {
    return type === 'Element';
  }
};


/**
 * Whether the given type name belongs to an extension package (not a CMMN
 * 1.1 package) of the given model.
 *
 * @param {Moddle} model
 * @param {string} name
 *
 * @return {boolean}
 */
export function isExtensionTypeName(model, name) {
  var prefix = isString(name) && name.indexOf(':') !== -1 && name.split(':')[0],
      pkg = prefix && model.getPackage(prefix);

  return !!(pkg && !CMMN_URI.test(pkg.uri));
}

/**
 * The generic stand-in type for an unknown element of an extension package.
 */
export function getGenericType() {
  return GENERIC_TYPE;
}
