import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

const Test = new Mongo.Collection('test');

if (Meteor.isServer) {
    Meteor.publish('tests', function testPublication() {
        return Test.find();
    });
}

Meteor.methods({

    'test.insert'(text) {
        check(text, String);

        if (!text) {
            throw new Meteor.Error('input is null');
        }

        Test.insert({
            text,
            createdAt: new Date(),
        });
    },
    'test.remove'(testID) {
        check(testID, String);

        Test.remove(testID);
    },
    'test.clear'() {
        Test.remove({});
    },

});

export default Test;
