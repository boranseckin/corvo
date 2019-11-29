import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import moment from 'moment';

const URL = new Mongo.Collection('url');

if (Meteor.isServer) {
    Meteor.publish('urls', function urlPublication() {
        return URL.find();
    });
}

function creatUrl(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i += 1) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

Meteor.methods({

    'url.insert'(realUrl, name, duration) {
        check(realUrl, String);
        check(name, String);
        check(duration, String);

        const shortUrl = creatUrl(5);
        let expire;

        if (duration === '1h') {
            expire = moment(moment() + (60000 * 60));
        } else if (duration === '24h') {
            expire = moment(moment() + (60000 * 60 * 24));
        } else if (duration === 'Unlimited') {
            expire = undefined;
        }

        URL.insert({
            shortUrl,
            realUrl,
            name,
            duration,
            createdAt: moment().format('dddd, MMMM Do YYYY, h:mm:ss a'),
            expireAt: expire ? expire.toDate() : null,
            userID: Meteor.userId(),
        });
    },
    'url.remove'(urlID) {
        check(urlID, String);

        URL.remove(urlID);
    },
    'url.clear'() {
        URL.remove({});
    },
});

export default URL;
