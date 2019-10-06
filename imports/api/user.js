/* eslint-disable no-underscore-dangle */
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import moment from 'moment';

Meteor.methods({
    'user.insert'(username, email, password) {
        check(username, String);
        check(email, String);
        check(password, String);

        const user = Accounts.createUser({
            username,
            email,
            password,
        });

        return user;
    },
    'user.sendVerificationEmail'(userId) {
        check(userId, String);

        Accounts.sendVerificationEmail(userId);
    },
    'user.checkResetToken'(token) {
        check(token, String);

        const user = Meteor.users.findOne({
            'services.password.reset.token': token,
        });

        if (!user) {
            throw new Meteor.Error(403, 'Token is not valid!');
        }

        const expire = Accounts._getPasswordResetTokenLifetimeMs();
        const { when } = user.services.password.reset;

        if (moment().diff(moment(when), 'minutes') > expire) {
            throw new Meteor.Error(403, 'Token is expired!');
        }
    },
});
