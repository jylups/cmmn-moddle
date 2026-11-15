import expect from '../../expect.js';

import { createModdle } from '../../helper.js';

import { normalizeAttributeWhitespace } from '../../../lib/attributes.js';


var NS = 'xmlns="http://www.omg.org/spec/CMMN/20151109/MODEL"';


describe('white space around the "=" of attributes', function() {

  var moddle;

  beforeEach(function() {
    moddle = createModdle();
  });


  function read(xml) {
    return moddle.fromXML(xml, 'cmmn:Task');
  }


  it('should read an attribute with white space before "="', function() {

    // when
    return read('<task ' + NS + ' id="Task_1" name ="Review" />').then(function(result) {

      // then
      expect(result.warnings).to.be.empty;
      expect(result.rootElement.get('name')).to.eql('Review');
      expect(result.rootElement.get('id')).to.eql('Task_1');
    });
  });


  it('should read attributes with white space and line breaks around "="', function() {

    // when
    return read(
      '<task ' + NS + ' id = "Task_1"\n  name\n  =\n  \'Review\' isBlocking= "false" />'
    ).then(function(result) {

      // then
      expect(result.warnings).to.be.empty;
      expect(result.rootElement.get('id')).to.eql('Task_1');
      expect(result.rootElement.get('name')).to.eql('Review');
      expect(result.rootElement.get('isBlocking')).to.be.false;
    });
  });


  it('should keep the attribute on save', function() {

    // given
    var xml = '<task ' + NS + ' id="Task_1" name ="Review" />';

    // when
    return read(xml).then(function(result) {
      return moddle.toXML(result.rootElement, { preamble: false });
    }).then(function(result) {

      // then
      expect(result.xml).to.eql('<task ' + NS + ' id="Task_1" name="Review" />');
    });
  });


  it('should keep the line of import warnings', function() {

    // given
    var xml =
      '<task ' + NS + '\n' +
      '  id = "Task_1"\n' +
      '  name\n' +
      '  =\n' +
      '  "Review">\n' +
      '  <unknownElement />\n' +
      '</task>';

    // when
    return read(xml).then(function(result) {

      // then
      expect(result.rootElement.get('name')).to.eql('Review');
      expect(result.warnings).to.have.length(1);
      expect(result.warnings[0].message).to.contain('line: 5');
    });
  });


  describe('normalizeAttributeWhitespace', function() {

    it('should move the white space behind the value', function() {

      // then
      expect(normalizeAttributeWhitespace('<a b ="1" c= \'2\'/>')).to.eql('<a b="1"  c=\'2\' />');
    });


    it('should keep the length and the line breaks', function() {

      // given
      var xml = '<a\n  b\n  =\n  "1"\n/>';

      // when
      var normalized = normalizeAttributeWhitespace(xml);

      // then
      expect(normalized.length).to.eql(xml.length);
      expect(normalized.split('\n').length).to.eql(xml.split('\n').length);
      expect(normalized).to.eql('<a\n  b="1"\n  \n  \n/>');
    });


    it('should not change text, comments, CDATA, values or declarations', function() {

      // given
      var xml =
        '<?xml version = "1.0"?>' +
        '<!DOCTYPE a [ <!ENTITY e "x = y"> ]>' +
        '<a b="c = d" e="f > g">text a = b<!-- c = d --><![CDATA[ e = f ]]></a >';

      // then
      expect(normalizeAttributeWhitespace(xml)).to.equal(xml);
    });


    it('should leave an attribute without a quoted value to the parser', function() {

      // then
      expect(normalizeAttributeWhitespace('<a b =c/>')).to.equal('<a b =c/>');
    });

  });

});
