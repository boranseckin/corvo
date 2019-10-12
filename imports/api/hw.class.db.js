import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';

const HWClass = new Mongo.Collection('hwClass');

if (Meteor.isServer) {
    Meteor.publish('hwClass', function hwPublication() {
        return HWClass.find();
    });
    Meteor.publish('hwClassOne', function hwPublication(className) {
        check(className, String);

        return HWClass.find({ name: className });
    });
}

Match._id = Match.Where((id) => {
    check(id, String);
    return /\b[a-zA-Z0-9]{17}\b/.test(id);
});

Meteor.methods({
    'hw.class.insert'(name, code, teacher, room, url) {
        check(name, String);
        check(code, String);
        check(teacher, String);
        check(room, Number);
        check(url, Match.Maybe(String));

        if (!Meteor.userId()) {
            throw new Meteor.Error('User not logged in!');
        }

        HWClass.insert({
            name,
            code,
            teacher,
            room,
            url,
            userID: Meteor.userId(),
        });
    },
    'hw.class.list'(userID) {
        check(userID, String);

        const query = HWClass.find({ userID }).fetch();
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

        if (!Meteor.userId()) {
            throw new Meteor.Error('User not logged in!');
        }

        HWClass.remove(hwClassID);
    },
    'hw.class.clear'() {
        HWClass.remove({});
    },
});

export default HWClass;
