/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'chai';

import HW from './hw.db.js';

if (Meteor.isServer) {
    describe('DB-HW', () => {
        describe('methods', () => {
            const userID = Random.id();
            let hwID;

            beforeEach(() => {
                HW.remove({});
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

            it('can delete hw', () => {
                const deleteHW = Meteor.server.method_handlers['hw.remove'];
                const invocation = { userID };

                deleteHW.apply(invocation, [hwID]);

                assert.equal(HW.find().count(), 0);
            });
        });
    });
}
