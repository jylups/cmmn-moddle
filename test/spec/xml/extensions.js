import expect from '../../expect.js';

import { createModdle } from '../../helper.js';


/**
 * A small extension package with one known element.
 */
var examplePackage = {
  name: 'Example',
  uri: 'http://example.org/cmmn',
  prefix: 'ex',
  xml: { tagAlias: 'lowerCase' },
  types: [
    {
      name: 'Known',
      superClass: [ 'Element' ],
      properties: [
        { name: 'value', isAttr: true, type: 'String' }
      ]
    }
  ]
};

var NS = 'xmlns="http://www.omg.org/spec/CMMN/20151109/MODEL" xmlns:ex="http://example.org/cmmn"';


describe('extension packages', function() {

  var moddle;

  beforeEach(function() {
    moddle = createModdle({ ex: examplePackage });
  });


  function read(xml) {
    return moddle.fromXML(xml, 'cmmn:Task');
  }


  describe('unknown elements of an extension package', function() {

    var xml =
      '<task ' + NS + ' id="Task_1">' +
        '<extensionElements>' +
          '<ex:known value="1" />' +
          '<ex:custom-element attr="a">' +
            '<ex:nested>text &amp; more</ex:nested>' +
            '<ex:empty />' +
          '</ex:custom-element>' +
          '<ex:flag>true</ex:flag>' +
        '</extensionElements>' +
      '</task>';


    it('should read them as generic elements, without warnings', async function() {

      // when
      var result = await read(xml);

      // then
      var values = result.rootElement.extensionElements.values;

      expect(result.warnings).to.be.empty;

      expect(values.map(function(value) {
        return value.$type;
      })).to.eql([ 'ex:Known', 'ex:custom-element', 'ex:flag' ]);

      expect(values[1].attr).to.eql('a');
      expect(values[1].$children.map(function(child) {
        return child.$type;
      })).to.eql([ 'ex:nested', 'ex:empty' ]);
      expect(values[1].$children[0].$body).to.eql('text & more');
      expect(values[2].$body).to.eql('true');
    });


    it('should write them back', async function() {

      // when
      var result = await read(xml);
      var written = await moddle.toXML(result.rootElement, { preamble: false });

      // then
      expect(written.xml).to.eql(xml);
    });

  });


  describe('unknown elements of a CMMN package', function() {

    it('should still be dropped with a warning', async function() {

      // when
      var result = await read(
        '<task ' + NS + ' id="Task_1">' +
          '<extensionElements><unknownCmmnElement /></extensionElements>' +
        '</task>'
      );

      // then
      expect(result.warnings.map(function(warning) {
        return warning.message.split('\n')[0];
      })).to.eql([ 'unparsable content <unknownCmmnElement> detected' ]);

      expect(result.rootElement.extensionElements.values || []).to.be.empty;
    });

  });


  describe('unknown types outside of reading', function() {

    it('should still not be created', function() {

      expect(function() {
        moddle.create('ex:custom-element');
      }).to.throw(/unknown type <ex:custom-element>/);
    });

  });

});
