/* eslint-disable meteor/no-session */
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Tracker } from 'meteor/tracker';

import '../lib/routes.js';

Meteor.startup(() => {
    Tracker.autorun(() => {
        Meteor.call('ip', function(error, result) {
            Session.set('serverIP', result.ip);
        });
    });
});
