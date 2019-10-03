/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

if (Meteor.isServer) {
    describe('Users', function() {
        describe('methods', function() {
            const userID = Random.id();

            beforeEach(() => {
                resetDatabase();
            });

            it('can create user', function() {
                const createUser = Meteor.server.method_handlers['user.insert'];
                const invocation = { userID };

                createUser.apply(invocation, ['johndoe', 'example@example.com', 'supersecretpassword']);

                const query = Meteor.users.find({ username: 'johndoe' }).fetch();
                assert.equal(query[0].username, 'johndoe');
            });
        });
    });
}
