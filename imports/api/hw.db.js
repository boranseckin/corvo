import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';

const HW = new Mongo.Collection('hw');

if (Meteor.isServer) {
    Meteor.publish('hws', function hwPublication() {
        return HW.find();
    });
}

Match._id = Match.Where((id) => {
    check(id, String);
    return /\b[a-zA-Z0-9]{17}\b/.test(id);
});

Match.subject = Match.Where((subject) => {
    check(subject, String);

    // Accepted Subjects
    const subjects = ['Math', 'Physics', 'Chem', 'Eng', 'CS'];

    return subjects.includes(subject);
});

Match.submitMethod = Match.Where((method) => {
    check(method, String);

    // Accepted Submit Methods
    const methods = ['Paper', 'Classroom'];

    return methods.includes(method);
});

Match.dueDate = Match.Where((date) => {
    check(date, Date);
    return date > new Date();
});

Match.description = Match.Where((description) => {
    check(description, String);
    return description.length < 300;
});

Meteor.methods({
    'hw.insert'(alias, subject, dueDate, submitMethod, partners, description) {
        check(alias, String);
        check(subject, Match.subject);
        check(dueDate, Match.dueDate);
        check(submitMethod, Match.submitMethod);
        check(partners, Match.Optional([String]));
        check(description, Match.Optional(Match.description));

        HW.insert({
            alias,
            subject,
            dueDate,
            createdAt: new Date(),
            submitMethod,
            partners,
            description,
            isCompleted: false,
        });
    },
    'hw.remove'(hwID) {
        check(hwID, Match._id);

        HW.remove(hwID);
    },
    'hw.complete'(hwID) {
        check(hwID, Match._id);

        HW.update({ _id: hwID }, { $set: { isCompleted: true } });
    },
    'hw.edit'(hwID, editField, edit) {
        check(hwID, Match._id);
        check(editField, String);
        check(edit, Match.Any);

        if (editField === 'alias') {
            check(edit, String);
        } else if (editField === 'subject') {
            check(edit, Match.subject);
        } else if (editField === 'dueDate') {
            check(edit, Match.dueDate);
        } else if (editField === 'submitMethod') {
            check(edit, Match.submitMethod);
        } else if (editField === 'partners') {
            check(edit, Match.Optional([String]));
        } else if (editField === 'description') {
            check(edit, Match.Optional(Match.description));
        } else {
            return;
        }

        HW.update({ _id: hwID }, { $set: { [editField]: edit } });
    },
    'hw.clear'() {
        HW.remove({});
    },
});

export default HW;
