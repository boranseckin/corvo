import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import '../imports/api/db.js';
import '../imports/api/user.js';
import '../imports/api/url.db.js';
import '../imports/api/hw.db.js';
import '../imports/api/hw.class.db.js';

Meteor.startup(() => {
    Accounts.config({ loginExpirationInDays: 30 });

    Accounts.emailTemplates.from = 'Corvo Verify <no-reply@boranseckin.com>';

    Accounts.urls.verifyEmail = function (token) {
        return Meteor.absoluteUrl(`verify/token/${token}`);
    };

    Accounts.emailTemplates.verifyEmail = {
        subject() {
            return 'Welcome to Corvo!';
        },
        text(user, url) {
            return `Hello ${user.username},\n\n`
            + 'To verify your account, simply click the link below:\n\n'
            + `<a href=${url}>Click here to verify!<a/>\n\n`
            + 'Thanks.';
        },
    };

    process.env.MAIL_URL = Meteor.settings.mail.smtp;
});
