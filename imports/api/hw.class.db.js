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
    'hw.class.insert'(name, code, teacher, room) {
        check(name, String);
        check(code, String);
        check(teacher, String);
        check(room, Number);

        HWClass.insert({
            name,
            code,
            teacher,
            room,
        });
    },
    'hw.class.remove'(hwClassID) {
        check(hwClassID, Match._id);

        HWClass.remove(hwClassID);
    },
    'hw,class.clear'() {
        HWClass.remove({});
    },
});

export default HWClass;
