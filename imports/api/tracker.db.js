import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';
import moment from 'moment';

const TRACK = new Mongo.Collection('track');

function parseAction(action) {
    const parsed = action.split('.');
    return {
        category: parsed[0],
        action: parsed[1],
    };
}

function createDate() {
    return moment().toDate();
}

Match._id = Match.Where((id) => {
    check(id, String);

    if (id === 'system') {
        return true;
    }

    return /\b[a-zA-Z0-9]{17}\b/.test(id);
});

Match.actionName = Match.Where((action) => {
    check(action, String);

    const categories = ['hw', 'hwClass', 'url', 'test', 'user', 'track'];
    const { category } = parseAction(action);

    return categories.includes(category);
});

Meteor.methods({
    'track.newAction'(userID, action, targetID = null) {
        check(userID, Match._id);
        check(action, Match.actionName);
        check(targetID, Match.Maybe(Match._id));

        const { category, action: parsedAction } = parseAction(action);

        TRACK.insert({
            category,
            action: parsedAction,
            userID,
            targetID,
            date: createDate(),
        });
    },
    'track.clear'() {
        if (Meteor.userId() && process.env.SU) {
            const { username } = Meteor.user(Meteor.userId());
            if (process.env.SU.includes(username)) {
                TRACK.remove({}, (err) => {
                    if (err) {
                        throw new Meteor.Error(`track.clear: ${err}`);
                    }
                    Meteor.call('track.newAction', Meteor.userId(), 'track.clear');
                });
            } else {
                throw new Meteor.Error('track.clear: Unauthorized user!');
            }
        }
    },
});
