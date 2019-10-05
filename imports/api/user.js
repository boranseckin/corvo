import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';

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
});
