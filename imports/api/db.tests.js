/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'chai';

import Test from './db.js';

if (Meteor.isServer) {
    describe('DB-Test', () => {
        describe('methods', () => {
            const userID = Random.id();
            let taskID;

            beforeEach(() => {
                Test.remove({});
                taskID = Test.insert({
                    text: 'Test entry',
                    createdAt: new Date(),
                });
            });

            it('can delete task', () => {
                const deleteTask = Meteor.server.method_handlers['test.remove'];
                const invocation = { userID };

                deleteTask.apply(invocation, [taskID]);

                assert.equal(Test.find().count(), 0);
            });
        });
    });
}
