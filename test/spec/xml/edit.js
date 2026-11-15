import expect from '../../expect.js';

import {
  createModdle
} from '../../helper.js';

import {
  fromFile as readFromFile,
  validate,
  toXML
} from '../../xml-helper.js';


describe('cmmn-moddle - edit', function() {

  var moddle = createModdle();

  function fromFile(file) {
    return readFromFile(moddle, file);
  }


  describe('save after change', function() {

    it('should serialize changed name', async function() {

      // given
      var {
        rootElement: result
      } = await fromFile('test/fixtures/cmmn/simple.cmmn');

      result.cases[0].name = 'OTHER CASE';

      // when
      var {
        xml
      } = await toXML(result, { format: true });

      // then
      expect(xml).to.contain('name="OTHER CASE"');
    });

  });


  describe('open and save', function() {

    // XSD validation runs in a Java process; starting it and compiling the
    // validator can take several seconds on a fresh CI runner
    this.timeout(30000);

    it('should valid diagram', async function() {

      // given
      var {
        rootElement: result
      } = await fromFile('test/fixtures/cmmn/roundtrip.cmmn');

      // when
      var {
        xml
      } = await toXML(result, { format: true });

      // then
      await validate(xml);
    });


    it('should keep start trigger events', async function() {

      // given
      var {
        rootElement: result
      } = await fromFile('test/fixtures/cmmn/start-triggers.cmmn');

      // when
      var {
        xml
      } = await toXML(result, { format: true });

      // then
      expect(xml).to.contain('<cmmn:standardEvent>complete</cmmn:standardEvent>');
      expect(xml).to.contain('<cmmn:standardEvent>update</cmmn:standardEvent>');
      expect(xml).not.to.contain('standardEvent="');

      await validate(xml);
    });

  });

});
