import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';
import moment from 'moment';

const HWClass = new Mongo.Collection('hwClass');

if (Meteor.isServer) {
    Meteor.publish('hwClass', function hwPublication() {
        return HWClass.find();
    });
    Meteor.publish('hwClassOne', function hwPublication(classID) {
        check(classID, String);

        return HWClass.find({ _id: classID });
    });
}

Match._id = Match.Where((id) => {
    check(id, String);
    return /\b[a-zA-Z0-9]{17}\b/.test(id);
});

Meteor.methods({
    'hw.class.insert'(name, code, teacher, room, url, color) {
        check(name, String);
        check(code, String);
        check(teacher, String);
        check(room, String);
        check(url, Match.Maybe(String));
        check(color, Match.Maybe(String));

        HWClass.insert({
            name,
            code,
            teacher,
            room,
            url,
            color: color || '#ffffff',
            createdAt: moment().toDate(),
            userID: Meteor.userId(),
            isDeleted: false,
        }, (err, res) => {
            if (err) {
                throw new Meteor.Error(`hw.class.insert: ${err}`);
            }
            if (!Meteor.isTest) {
                Meteor.call('track.newAction', Meteor.userId(), 'hwClass.insert', res);
            }
        });
    },
    'hw.class.list'(userID) {
        check(userID, String);

        const query = HWClass.find({ userID, isDeleted: false }).fetch();
        const result = [];
        query.forEach(function(hwClass) {
            const a = {
                key: hwClass._id,
                _id: hwClass._id,
                name: hwClass.name,
                code: hwClass.code,
            };
            result.push(a);
        });
        return result;
    },
    'hw.class.remove'(hwClassID) {
        check(hwClassID, Match._id);

        HWClass.update({ _id: hwClassID }, { $set: { isDeleted: true } }, (err) => {
            if (err) {
                throw new Meteor.Error(`hw.class.remove: ${err}`);
            }

            if (!Meteor.isTest) {
                Meteor.call('track.newAction', Meteor.userId(), 'hwClass.remove', hwClassID);
            }
        });
    },
    'hw.class.clear'() {
        if (Meteor.userId() && process.env.SU) {
            const { username } = Meteor.user(Meteor.userId());
            if (process.env.SU.includes(username)) {
                HWClass.remove({}, (err) => {
                    if (err) {
                        throw new Meteor.Error(`hw.class.clear: ${err}`);
                    }
                    if (!Meteor.isTest) {
                        Meteor.call('track.newAction', Meteor.userId(), 'hwClass.clear');
                    }
                });
            } else {
                throw new Meteor.Error('hw.class.clear: Unauthorized user!');
            }
        }
    },
});

export default HWClass;
