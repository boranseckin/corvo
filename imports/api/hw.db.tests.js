/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import HW from './hw.db.js';

if (Meteor.isServer) {
    describe('DB-HW', function() {
        describe('methods', function() {
            const userID = Random.id();
            let hwID;

            beforeEach(() => {
                resetDatabase();
                hwID = HW.insert({
                    alias: 'Test',
                    subject: 'Math',
                    dueDate: new Date(Date.now + (60000 * 5)),
                    createdAt: new Date(),
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

            it('can edit hw -> subject', function() {
                const editHW = Meteor.server.method_handlers['hw.edit'];
                const invocation = { userID };

                editHW.apply(invocation, [hwID, 'subject', 'CS']);

                const query = HW.find({ _id: hwID }).fetch();
                assert.equal(query[0].subject, 'CS');
            });

            it('can edit hw -> dueDate', function() {
                const editHW = Meteor.server.method_handlers['hw.edit'];
                const invocation = { userID };

                const date = new Date(Date.now() + (60000 * 3));

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
