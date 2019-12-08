import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';
import moment from 'moment';

const HW = new Mongo.Collection('hw');

if (Meteor.isServer) {
    Meteor.publish('hws', function hwPublication() {
        return HW.find();
    });
}

function createDate() {
    return moment().toDate();
}

Match._id = Match.Where((id) => {
    check(id, String);
    return /\b[a-zA-Z0-9]{17}\b/.test(id);
});

Match.submitMethod = Match.Where((method) => {
    check(method, String);

    // Accepted Submit Methods
    const methods = ['Paper', 'Classroom'];

    return methods.includes(method);
});

Match.dueDate = Match.Where((date) => {
    check(date, String);

    const dueDate = moment(date, 'dddd, MMMM Do YYYY, h:mm:ss a');

    if (dueDate.diff(moment(), 'hours') > 0) {
        return true;
    }

    return false;
});

Match.description = Match.Where((description) => {
    check(description, String);
    return description.length <= 300;
});

Meteor.methods({
    'hw.insert'(alias, classID, dueDate, submitMethod, partners, description) {
        check(alias, String);
        check(classID, Match._id);
        check(dueDate, Match.dueDate);
        check(submitMethod, Match.submitMethod);
        check(partners, Match.Optional([String]));
        check(description, Match.Maybe(Match.description));

        const dateDueDate = moment(dueDate, 'dddd, MMMM Do YYYY, h:mm:ss a').toDate();

        HW.insert({
            alias,
            classID,
            dueDate: dateDueDate,
            createdAt: createDate(),
            submitMethod,
            partners,
            description,
            isCompleted: false,
            isDeleted: false,
            userID: Meteor.userId(),
        }, (err, res) => {
            if (err) {
                throw new Meteor.Error(`hw.insert: ${err}`);
            }

            if (!Meteor.isTest) {
                Meteor.call('track.newAction', Meteor.userId(), 'hw.insert', res);
            }
        });
    },
    'hw.remove'(hwID) {
        check(hwID, Match._id);

        HW.update({ _id: hwID }, { $set: { isDeleted: true } }, (err) => {
            if (err) {
                throw new Meteor.Error(`hw.remove: ${err}`);
            }

            if (!Meteor.isTest) {
                Meteor.call('track.newAction', Meteor.userId(), 'hw.remove', hwID);
            }
        });
    },
    'hw.complete'(hwID) {
        check(hwID, Match._id);

        HW.update({ _id: hwID }, { $set: { isCompleted: true } }, (err) => {
            if (err) {
                throw new Meteor.Error(`hw.complete: ${err}`);
            }

            if (!Meteor.isTest) {
                Meteor.call('track.newAction', Meteor.userId(), 'hw.complete', hwID);
            }
        });
    },
    'hw.update'(hwID, alias, classID, dueDate, submitMethod, partners, description) {
        check(hwID, Match._id);
        check(alias, String);
        check(classID, Match._id);
        check(dueDate, Match.dueDate);
        check(submitMethod, Match.submitMethod);
        check(partners, Match.Optional([String]));
        check(description, Match.Maybe(Match.description));

        const dateDueDate = moment(dueDate, 'dddd, MMMM Do YYYY, h:mm:ss a').toDate();

        HW.update({ _id: hwID }, {
            $set: {
                alias,
                classID,
                dueDate: dateDueDate,
                submitMethod,
                partners,
                description,
            },
        }, (err) => {
            if (err) {
                throw new Meteor.Error(`hw.update: ${err}`);
            }

            if (!Meteor.isTest) {
                Meteor.call('track.newAction', Meteor.userId(), 'hw.update', hwID);
            }
        });
    },
    'hw.clear'() {
        if (Meteor.userId() && process.env.SU) {
            const { username } = Meteor.user(Meteor.userId());
            if (process.env.SU.includes(username)) {
                HW.remove({}, (err) => {
                    if (err) {
                        throw new Meteor.Error(`hw.clear: ${err}`);
                    }
                    if (!Meteor.isTest) {
                        Meteor.call('track.newAction', Meteor.userId(), 'hw.clear');
                    }
                });
            } else {
                throw new Meteor.Error('hw.clear: Unauthorized user!');
            }
        }
    },
});

export default HW;
