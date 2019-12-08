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
                    userID,
                });
                hwID = HW.insert({
                    alias: 'Test',
                    classID,
                    dueDate: moment().add(1, 'days').toDate(),
                    createdAt: moment().toDate(),
                    submitMethod: 'Classroom',
                    partners: ['TestPerson1', 'TestPerson2'],
                    description: 'ToT',
                    isCompleted: false,
                });
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

                assert.equal(HW.find({ isCompleted: false }).count(), 0);
            });

            it('can delete hw', function() {
                const deleteHW = Meteor.server.method_handlers['hw.remove'];
                const invocation = { userID };

                deleteHW.apply(invocation, [hwID]);

                assert.equal(HW.find({ isDeleted: false }).count(), 0);
            });
        });
    });
}
