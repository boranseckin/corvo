import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import '../imports/api/db.js';
import '../imports/api/user.js';
import '../imports/api/url.db.js';
import '../imports/api/hw.db.js';
import '../imports/api/hw.class.db.js';

Meteor.startup(() => {
    Accounts.emailTemplates.from = 'Corvo Verify <verify@boranseckin.com>';
    process.env.MAIL_URL = Meteor.settings.mail.smtp;
});
