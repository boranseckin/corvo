/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import assert from 'assert';
import '../imports/api/db.tests.js';
import '../imports/api/url.db.tests.js';

describe('corvo', function () {
    it('package.json has correct name', async function () {
        const { name } = await import('../package.json');
        assert.strictEqual(name, 'corvo');
    });

    if (Meteor.isClient) {
        it('client is not server', function () {
            assert.strictEqual(Meteor.isServer, false);
        });
    }

    if (Meteor.isServer) {
        it('server is not client', function () {
            assert.strictEqual(Meteor.isClient, false);
        });
    }
});
