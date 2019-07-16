import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { HTTP } from 'meteor/http';

const URL = new Mongo.Collection('url');

if (Meteor.isServer) {
    Meteor.publish('urls', function urlPublication() {
        return URL.find();
    });
}

function isUrl(s) {
    const regexp = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}|[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,})/;
    return regexp.test(s);
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

        if (!realUrl) {
            throw new Meteor.Error('No URL is submitted!');
        } else if (!isUrl(realUrl)) {
            throw new Meteor.Error('URL is not valid!');
        }

        const shortUrl = creatUrl(5);
        let expire;

        if (duration === '1h') {
            expire = new Date(Date.now() + (60000 * 60));
        } else if (duration === '24h') {
            expire = new Date(Date.now() + (60000 * 60 * 24));
        } else if (duration === 'Unlimited') {
            expire = undefined;
        }

        URL.insert({
            shortUrl,
            realUrl,
            name,
            duration,
            createdAt: new Date(),
            expireAt: expire,
        });
    },
    'url.remove'(urlID) {
        check(urlID, String);

        URL.remove(urlID);
    },
    'url.clear'() {
        URL.remove({});
    },
    'ip'() {
        return HTTP.get('https://json.geoiplookup.io/').data;
    },

});

export default URL;
