import expect from '../../expect.js';

import {
  createModdle,
  readFile
} from '../../helper.js';

describe('cmmn-moddle - read', function() {

  var moddle = createModdle();

  function read(xml, root, opts) {
    return moddle.fromXML(xml, root, opts);
  }

  function fromFile(file, root, opts) {
    var contents = readFile(file);
    return read(contents, root, opts);
  }


  describe('should import types', function() {

    describe('cmmn', function() {

      it('ExtensionElements', async function() {

        // when
        var {
          rootElement: result
        } = await fromFile('test/fixtures/cmmn/extension-elements.cmmn');

        expect(result).to.jsonEqual({
          $type: 'cmmn:Definitions',
          id: 'test',
          targetNamespace: 'http://bpmn.io/schema/cmmn',
          extensionElements: {
            $type : 'cmmn:ExtensionElements',
            values : [
              { $type: 'vendor:info', key: 'bgcolor', value: '#ffffff' },
              { $type: 'vendor:info', key: 'role', value: '[]' }
            ]
          }
        });
      });

      it('Artifacts', async function() {

        // when
        var {
          rootElement: result
        } = await fromFile('test/fixtures/cmmn/artifacts.cmmn');

        expect(result.artifacts).to.jsonEqual([
          {
            $type: 'cmmn:TextAnnotation',
            id: 'TextAnnotation_1',
            text: 'This is a text annotation'
          },
          {
            $type: 'cmmn:Association',
            id: 'Association_1'
          },
          {
            $type: 'cmmn:Association',
            id: 'Association_2',
            associationDirection: 'One'
          }
        ]);

        var planItem = result.cases[0].casePlanModel.planItems[0];
        var textAnnotation = result.artifacts[0];
        var association = result.artifacts[1];

        expect(association.sourceRef).to.jsonEqual(planItem);
        expect(association.targetRef).to.jsonEqual(textAnnotation);

      });

    });

    describe('references', function() {

      it('CaseFileItem#targetRefs', async function() {

        // when
        var {
          rootElement: result
        } = await fromFile('test/fixtures/cmmn/case-file-item-target-refs.cmmn');

        var caseFileModel = result.cases[0].caseFileModel;

        var caseFileItem1 = caseFileModel.caseFileItems[0];
        var caseFileItem2 = caseFileModel.caseFileItems[1];
        var caseFileItem3 = caseFileModel.caseFileItems[2];

        expect(caseFileItem1.targetRefs[0]).to.jsonEqual(caseFileItem2);
        expect(caseFileItem1.targetRefs[1]).to.jsonEqual(caseFileItem3);
      });

      it('CaseFileItem#sourceRef', async function() {

        // when
        var {
          rootElement: result
        } = await fromFile('test/fixtures/cmmn/case-file-item-target-refs.cmmn');

        var caseFileModel = result.cases[0].caseFileModel;

        var caseFileItem1 = caseFileModel.caseFileItems[0];
        var caseFileItem2 = caseFileModel.caseFileItems[1];

        expect(caseFileItem2.sourceRef).to.jsonEqual(caseFileItem1);
      });

    });

  });


  describe('start triggers', function() {

    it('PlanItemStartTrigger#standardEvent', async function() {

      // when
      var {
        rootElement: result,
        warnings
      } = await fromFile('test/fixtures/cmmn/start-triggers.cmmn');

      var timerEventListener = result.cases[0].casePlanModel.planItemDefinitions[1];

      // then
      expect(warnings).to.be.empty;
      expect(timerEventListener.timerStart.$type).to.eql('cmmn:PlanItemStartTrigger');
      expect(timerEventListener.timerStart.standardEvent).to.eql('complete');
    });


    it('CaseFileItemStartTrigger#standardEvent', async function() {

      // when
      var {
        rootElement: result
      } = await fromFile('test/fixtures/cmmn/start-triggers.cmmn');

      var timerEventListener = result.cases[0].casePlanModel.planItemDefinitions[2];

      // then
      expect(timerEventListener.timerStart.$type).to.eql('cmmn:CaseFileItemStartTrigger');
      expect(timerEventListener.timerStart.standardEvent).to.eql('update');
    });

  });


  describe('should handle errors', function() {

    it('when importing duplicate ids', async function() {

      // when
      var {
        warnings
      } = await fromFile('test/fixtures/cmmn/error/duplicate-ids.cmmn');

      // then
      expect(warnings.length).to.eql(1);
      expect(warnings[0].message).to.contain('duplicate ID <test>');
    });

  });

});
