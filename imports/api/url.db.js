import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';
import moment from 'moment';

const URL = new Mongo.Collection('url');

if (Meteor.isServer) {
    Meteor.publish('urls', function urlPublication() {
        return URL.find();
    });
}

Match._id = Match.Where((id) => {
    check(id, String);
    return /\b[a-zA-Z0-9]{17}\b/.test(id);
});

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
            createdAt: moment().toDate(),
            expireAt: expire ? expire.toDate() : null,
            userID: Meteor.userId(),
            isDeleted: false,
        }, (err, res) => {
            if (err) {
                throw new Meteor.Error(`url.insert: ${err}`);
            }
            if (!Meteor.isTest) {
                Meteor.call('track.newAction', Meteor.userId(), 'url.insert', res);
            }
        });
    },
    'url.remove'(urlID) {
        check(urlID, Match._id);

        URL.update({ _id: urlID }, { $set: { isDeleted: true } }, (err) => {
            if (err) {
                throw new Meteor.Error(`url.remove: ${err}`);
            }
            if (!Meteor.isTest) {
                Meteor.call('track.newAction', Meteor.userId(), 'url.remove', urlID);
            }
        });
    },
    'url.clear'() {
        if (Meteor.userId() && process.env.SU) {
            const { username } = Meteor.user(Meteor.userId());
            if (process.env.SU.includes(username)) {
                URL.remove({}, (err) => {
                    if (err) {
                        throw new Meteor.Error(`url.clear: ${err}`);
                    }
                    if (!Meteor.isTest) {
                        Meteor.call('track.newAction', Meteor.userId(), 'url.clear');
                    }
                });
            } else {
                throw new Meteor.Error('url.clear: Unauthorized user!');
            }
        }
    },
});

export default URL;
