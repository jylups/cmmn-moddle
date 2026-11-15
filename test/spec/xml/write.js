import expect from '../../expect.js';

import {
  assign
} from 'min-dash';

import {
  createModdle
} from '../../helper.js';


describe('cmmn-moddle - write', function() {

  var moddle = createModdle();


  function write(element, options) {

    // skip preamble for tests
    options = assign({ preamble: false }, options);

    return moddle.toXML(element, options);
  }


  describe('should export types', function() {

    describe('cmmn', function() {

      it('PlanItemDefinition#DefaultControl', async function() {

        // given
        var control = moddle.create('cmmn:PlanItemControl');
        var humanTask = moddle.create('cmmn:HumanTask', {
          id: 'HumanTask_1',
          defaultControl: control
        });

        var expectedXML =
          '<cmmn:humanTask xmlns:cmmn="http://www.omg.org/spec/CMMN/20151109/MODEL" id="HumanTask_1">' +
             '<cmmn:defaultControl />' +
          '</cmmn:humanTask>';

        // when
        var {
          xml: result
        } = await write(humanTask);

        // then
        expect(result).to.eql(expectedXML);
      });

      it('PlanItem#ItemControl', async function() {

        // given
        var control = moddle.create('cmmn:PlanItemControl');
        var planItem = moddle.create('cmmn:PlanItem', {
          id: 'PI_HumanTask_1',
          itemControl: control,
          entryCriteria: [
            moddle.create('cmmn:EntryCriterion')
          ],
          exitCriteria: [
            moddle.create('cmmn:ExitCriterion')
          ]
        });

        var expectedXML =
          '<cmmn:planItem xmlns:cmmn="http://www.omg.org/spec/CMMN/20151109/MODEL" id="PI_HumanTask_1">' +
             '<cmmn:itemControl />' +
             '<cmmn:entryCriterion />' +
             '<cmmn:exitCriterion />' +
          '</cmmn:planItem>';

        // when
        var {
          xml: result
        } = await write(planItem);

        // then
        expect(result).to.eql(expectedXML);
      });

      it('DiscretionaryItem#ItemControl', async function() {

        // given
        var control = moddle.create('cmmn:PlanItemControl');
        var discretionaryItem = moddle.create('cmmn:DiscretionaryItem', {
          id: 'PI_HumanTask_1',
          itemControl: control
        });

        var expectedXML =
          '<cmmn:discretionaryItem xmlns:cmmn="http://www.omg.org/spec/CMMN/20151109/MODEL" id="PI_HumanTask_1">' +
             '<cmmn:itemControl />' +
          '</cmmn:discretionaryItem>';

        // when
        var {
          xml: result
        } = await write(discretionaryItem);

        // then
        expect(result).to.eql(expectedXML);
      });


      it('PlanItemStartTrigger#standardEvent', async function() {

        // given
        var startTrigger = moddle.create('cmmn:PlanItemStartTrigger', {
          id: 'PlanItemStartTrigger_1',
          standardEvent: 'complete'
        });

        var expectedXML =
          '<cmmn:planItemStartTrigger xmlns:cmmn="http://www.omg.org/spec/CMMN/20151109/MODEL" id="PlanItemStartTrigger_1">' +
             '<cmmn:standardEvent>complete</cmmn:standardEvent>' +
          '</cmmn:planItemStartTrigger>';

        // when
        var {
          xml: result
        } = await write(startTrigger);

        // then
        expect(result).to.eql(expectedXML);
      });


      it('CaseFileItemStartTrigger#standardEvent', async function() {

        // given
        var startTrigger = moddle.create('cmmn:CaseFileItemStartTrigger', {
          id: 'CaseFileItemStartTrigger_1',
          standardEvent: 'update'
        });

        var expectedXML =
          '<cmmn:caseFileItemStartTrigger xmlns:cmmn="http://www.omg.org/spec/CMMN/20151109/MODEL" id="CaseFileItemStartTrigger_1">' +
             '<cmmn:standardEvent>update</cmmn:standardEvent>' +
          '</cmmn:caseFileItemStartTrigger>';

        // when
        var {
          xml: result
        } = await write(startTrigger);

        // then
        expect(result).to.eql(expectedXML);
      });


      it('Definitions', async function() {

        // given
        var planItem = moddle.create('cmmn:PlanItem', {
          id: 'PlanItem_1'
        });

        var textAnnotation = moddle.create('cmmn:TextAnnotation', {
          id: 'TextAnnotation_1',
          text: 'FOOBAR'
        });

        var definitionsElement = moddle.create('cmmn:Definitions', {
          cases: [
            moddle.create('cmmn:Case', {
              casePlanModel: moddle.create('cmmn:Stage', {
                planItems: [
                  planItem
                ]
              })
            })
          ],
          artifacts: [
            textAnnotation,
            moddle.create('cmmn:Association', {
              id: 'Association_1',
              sourceRef: planItem,
              targetRef: textAnnotation
            }),
            moddle.create('cmmn:Association', {
              id: 'Association_2',
              associationDirection: 'One',
            })
          ]
        });

        var expectedXML =
          '<cmmn:definitions xmlns:cmmn="http://www.omg.org/spec/CMMN/20151109/MODEL">' +
             '<cmmn:case>' +
               '<cmmn:casePlanModel>' +
                 '<cmmn:planItem id="PlanItem_1" />' +
               '</cmmn:casePlanModel>' +
             '</cmmn:case>' +
             '<cmmn:textAnnotation id="TextAnnotation_1">' +
               '<cmmn:text>FOOBAR</cmmn:text>' +
             '</cmmn:textAnnotation>' +
             '<cmmn:association id="Association_1" sourceRef="PlanItem_1" targetRef="TextAnnotation_1" />' +
             '<cmmn:association id="Association_2" associationDirection="One" />' +
          '</cmmn:definitions>';

        // when
        var {
          xml: result
        } = await write(definitionsElement);

        // then
        expect(result).to.eql(expectedXML);
      });

    });

  });
});