import { Meteor } from 'meteor/meteor';
import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { mount } from 'react-mounter';

import App from '../imports/ui/App.jsx';
import Home from '../imports/ui/Home.jsx';
import Login from '../imports/ui/Login.jsx';
import Signup from '../imports/ui/Signup.jsx';
import Verify from '../imports/ui/Verify.jsx';
import UrlShort from '../imports/ui/UrlShort/UrlShort.jsx';
import UrlRedirect from '../imports/ui/UrlShort/UrlRedirect.jsx';
import HWTrack from '../imports/ui/HWTrack/HWTrack.jsx';
import RouteNotFound from '../imports/ui/RouteNotFound.jsx';

FlowRouter.route('/', {
    name: 'home',
    action: () => {
        mount(App, {
            content: <Home />,
            redirect: 'false',
        });
    },
});

FlowRouter.route('/login', {
    name: 'login',
    action: () => {
        mount(App, {
            content: <Login />,
            redirect: 'false',
        });
    },
});

FlowRouter.route('/signup', {
    name: 'signup',
    action: () => {
        mount(App, {
            content: <Signup />,
            redirect: 'false',
        });
    },
});

FlowRouter.route('/verify/:userId', {
    name: 'verify',
    action: (params) => {
        mount(App, {
            content: <Verify userId={params.userId} />,
            redirect: 'false',
        });
    },
});

FlowRouter.route('/verify/token/:token', {
    name: 'verify',
    action: (params) => {
        mount(App, {
            content: <Verify token={params.token} />,
            redirect: 'false',
        });
    },
});

FlowRouter.route('/logout', {
    name: 'logout',
    action: () => {
        Meteor.logout();
        FlowRouter.go('/');
    },
});

FlowRouter.route('/url', {
    name: 'urlshort',
    action: () => {
        mount(App, {
            content: <UrlShort />,
            redirect: 'false',
        });
    },
});

FlowRouter.route('/r/:shortUrl', {
    name: 'urlredirect',
    action: (params) => {
        mount(App, {
            content: <UrlRedirect param={params.shortUrl} />,
        });
    },
});

const hwRoutes = FlowRouter.group({
    prefix: '/hw',
    name: 'hw',
});

hwRoutes.route('/', {
    action: () => {
        mount(App, {
            content: <HWTrack className="home" />,
            redirect: 'false',
        });
    },
});

hwRoutes.route('/:className', {
    action: (params) => {
        mount(App, {
            content: <HWTrack className={params.className} />,
            redirect: 'false',
        });
    },
});

FlowRouter.notFound = {
    action: () => {
        mount(App, {
            content: <RouteNotFound />,
        });
    },
};
