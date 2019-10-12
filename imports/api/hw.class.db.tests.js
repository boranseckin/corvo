/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import HWClass from './hw.class.db.js';

if (Meteor.isServer) {
    describe('DB-HW-Class', function() {
        describe('methods', function() {
            const userID = Random.id();
            let hwClassID;

            beforeEach(() => {
                resetDatabase();
                hwClassID = HWClass.insert({
                    name: 'TestClass',
                    code: 'TTT4U1-1',
                    teacher: 'John Doe',
                    room: 111,
                    userID,
                });
            });

            it('can delete hwClass', function() {
                const deleteHWClass = Meteor.server.method_handlers['hw.class.remove'];
                const invocation = { userID };

                deleteHWClass.apply(invocation, [hwClassID]);

                assert.equal(HWClass.find().count(), 0);
            });
        });
    });
}
