/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'chai';

import URL from './url.db.js';

if (Meteor.isServer) {
    describe('DB-URL', function() {
        describe('methods', function() {
            const userID = Random.id();
            let urlID;

            beforeEach(() => {
                URL.remove({});
                urlID = URL.insert({
                    url: 'http://example11.com',
                    duration: 0,
                    createdAt: new Date(),
                });
            });

            it('can delete url', function() {
                const deleteURL = Meteor.server.method_handlers['url.remove'];
                const invocation = { userID };

                deleteURL.apply(invocation, [urlID]);

                assert.equal(URL.find().count(), 0);
            });
        });
    });
}
