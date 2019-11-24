import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { HTTP } from 'meteor/http';

import '../imports/api/db.js';
import '../imports/api/user.js';
import '../imports/api/url.db.js';
import '../imports/api/hw.db.js';
import '../imports/api/hw.class.db.js';

Meteor.startup(() => {
    Accounts.config({ loginExpirationInDays: 30 });

    Accounts.emailTemplates.from = 'Corvo Account Manager <no-reply@boranseckin.com>';

    Accounts.urls.resetPassword = function (token) {
        return Meteor.absoluteUrl(`reset-password/token/${token}`);
    };

    Accounts.urls.verifyEmail = function (token) {
        return Meteor.absoluteUrl(`verify/token/${token}`);
    };

    Accounts.emailTemplates.resetPassword = {
        subject() {
            return 'Welcome to Corvo!';
        },
        text(user, url) {
            return `Hello ${user.username},\n\n`
            + 'To recover your account, simply click the link below:\n\n'
            + `${url}\n\n`
            + 'Thanks.';
        },
    };

    Accounts.emailTemplates.verifyEmail = {
        subject() {
            return 'Welcome to Corvo!';
        },
        text(user, url) {
            return `Hello ${user.username},\n\n`
            + 'To verify your account, simply click the link below:\n\n'
            + `${url}\n\n`
            + 'Thanks.';
        },
    };

    if (Meteor.settings.mail) {
        process.env.MAIL_URL = Meteor.settings.mail.smtp;
    }

    HTTP.get('https://api.github.com/repos/boranseckin/corvo/releases/latest', {
        headers: {
            'User-Agent': 'Meteor',
        },
    }, (err, res) => {
        if (!err && res.data) {
            process.env.CORVO_VERSION = res.data.tag_name;
            Meteor.methods({
                'CORVO_VERSION'() {
                    return process.env.CORVO_VERSION;
                },
            });
        }
    });
});
