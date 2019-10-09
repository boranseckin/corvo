import { Meteor } from 'meteor/meteor';
import React from 'react';
import { mount } from 'react-mounter';
import { FlowRouter } from 'meteor/kadira:flow-router';

import App from '../imports/ui/App.jsx';
import Home from '../imports/ui/Home.jsx';
import Login from '../imports/ui/Login.jsx';
import Signup from '../imports/ui/Signup.jsx';
import Verify from '../imports/ui/Verify.jsx';
import ResetPassword from '../imports/ui/ResetPassword.jsx';
import ForgotPassword from '../imports/ui/ForgotPassword.jsx';
import UrlShort from '../imports/ui/UrlShort/UrlShort.jsx';
import UrlRedirect from '../imports/ui/UrlShort/UrlRedirect.jsx';
import HWTrack from '../imports/ui/HWTrack/HWTrack.jsx';
import RouteNotFound from '../imports/ui/RouteNotFound.jsx';

const userCheck = (context, redirect) => {
    if (!Meteor.userId()) {
        redirect('/login');
    }

    const user = Meteor.user();
    if (user && !user.emails[0].verified) {
        redirect('/verify/reminder');
    }
};

FlowRouter.triggers.enter([userCheck], { only: ['hw'] });

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
        Meteor.logout();
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
    name: 'verifyToken',
    action: (params) => {
        mount(App, {
            content: <Verify token={params.token} />,
            redirect: 'false',
        });
    },
});

FlowRouter.route('/reset-password/token/:token', {
    name: 'resetPassword',
    action: (params) => {
        mount(App, {
            content: <ResetPassword token={params.token} />,
            redirect: 'false',
        });
    },
});

FlowRouter.route('/logout', {
    name: 'logout',
    triggersEnter: [function(context, redirect) {
        Meteor.logout();
        redirect('/');
    }],
});

FlowRouter.route('/forgot-password', {
    name: 'forgotPassword',
    action: () => {
        mount(App, {
            content: <ForgotPassword />,
            redirect: 'false',
        });
    },
});

FlowRouter.route('/url', {
    name: 'url',
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
});

hwRoutes.route('/', {
    name: 'hw',
    action: () => {
        mount(App, {
            content: <HWTrack className="home" />,
            redirect: 'false',
        });
    },
});

hwRoutes.route('/:className', {
    name: 'hw',
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
