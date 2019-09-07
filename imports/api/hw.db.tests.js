/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'chai';
import { moment } from 'meteor/momentjs:moment';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import HW from './hw.db.js';
import HWClass from './hw.class.db.js';

if (Meteor.isServer) {
    describe('DB-HW', function() {
        describe('methods', function() {
            const userID = Random.id();
            let hwID;
            let classID;

            beforeEach(() => {
                resetDatabase();
                classID = HWClass.insert({
                    name: 'TestClass',
                    code: 'TTT4U1-1',
                    teacher: 'John Doe',
                    room: 111,
                });
                hwID = HW.insert({
                    alias: 'Test',
                    classID,
                    dueDate: moment().add(1, 'days').format('dddd, MMMM Do YYYY, h:mm:ss a'),
                    createdAt: moment().format('dddd, MMMM Do YYYY, h:mm:ss a'),
                    submitMethod: 'Classroom',
                    partners: ['TestPerson1', 'TestPerson2'],
                    description: 'ToT',
                    isCompleted: false,
                });
            });

            it('can edit hw -> alias', function() {
                const editHW = Meteor.server.method_handlers['hw.edit'];
                const invocation = { userID };

                editHW.apply(invocation, [hwID, 'alias', 'editedTest']);

                const query = HW.find({ _id: hwID }).fetch();
                assert.equal(query[0].alias, 'editedTest');
            });

            it('can edit hw -> classID', function() {
                const editHW = Meteor.server.method_handlers['hw.edit'];
                const invocation = { userID };

                editHW.apply(invocation, [hwID, 'classID', classID]);

                const query = HW.find({ _id: hwID }).fetch();
                assert.equal(query[0].classID, classID);
            });

            it('can edit hw -> dueDate', function() {
                const editHW = Meteor.server.method_handlers['hw.edit'];
                const invocation = { userID };

                const date = moment().add(2, 'days').format('dddd, MMMM Do YYYY, h:mm:ss a');

                editHW.apply(invocation, [hwID, 'dueDate', date]);

                const query = HW.find({ _id: hwID }).fetch();
                assert.deepEqual(date, query[0].dueDate);
            });

            it('can edit hw -> submitMerhod', function() {
                const editHW = Meteor.server.method_handlers['hw.edit'];
                const invocation = { userID };

                editHW.apply(invocation, [hwID, 'submitMethod', 'Paper']);

                const query = HW.find({ _id: hwID }).fetch();
                assert.equal(query[0].submitMethod, 'Paper');
            });

            it('can edit hw -> partners', function() {
                const editHW = Meteor.server.method_handlers['hw.edit'];
                const invocation = { userID };

                editHW.apply(invocation, [hwID, 'partners', ['TP1', 'TP2']]);

                const query = HW.find({ _id: hwID }).fetch();
                assert.equal(query[0].partners[0], 'TP1');
                assert.equal(query[0].partners[1], 'TP2');
            });

            it('can edit hw -> description', function() {
                const editHW = Meteor.server.method_handlers['hw.edit'];
                const invocation = { userID };

                editHW.apply(invocation, [hwID, 'description', 'LoremDescriptionIpsum']);

                const query = HW.find({ _id: hwID }).fetch();
                assert.equal(query[0].description, 'LoremDescriptionIpsum');
            });

            it('can update hw', function() {
                const updateHW = Meteor.server.method_handlers['hw.update'];
                const invocation = { userID };

                updateHW.apply(invocation, [
                    hwID,
                    'Test',
                    classID,
                    moment().add(3, 'days').format('dddd, MMMM Do YYYY, h:mm:ss a'),
                    'Classroom',
                    ['UpdateTestPerson1', 'UpdateTestPerson2', 'UpdateTestPerson3'],
                    'UpdateToT',
                ]);

                const query = HW.find({ _id: hwID }).fetch();
                assert.equal(query[0].alias, 'Test');
            });

            it('can complete hw', function() {
                const completeHW = Meteor.server.method_handlers['hw.complete'];
                const invocation = { userID };

                completeHW.apply(invocation, [hwID]);

                const query = HW.find({ _id: hwID }).fetch();
                assert.equal(query[0].isCompleted, true);
            });

            it('can delete hw', function() {
                const deleteHW = Meteor.server.method_handlers['hw.remove'];
                const invocation = { userID };

                deleteHW.apply(invocation, [hwID]);

                assert.equal(HW.find().count(), 0);
            });
        });
    });
}
