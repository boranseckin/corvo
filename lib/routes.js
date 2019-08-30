import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { mount } from 'react-mounter';

import App from '../imports/ui/App.jsx';
import Home from '../imports/ui/Home.jsx';
import UrlShort from '../imports/ui/UrlShort/UrlShort.jsx';
import UrlRedirect from '../imports/ui/UrlShort/UrlRedirect.jsx';
import HWTrack from '../imports/ui/HWTrack/HWTrack.jsx';
import RouteNotFound from '../imports/ui/RouteNotFound.jsx';

/* Redirect / to /url
FlowRouter.route('/', {
    name: 'home',
    triggersEnter: [function(context, redirect) {
        redirect('/url');
    }],
});
*/

FlowRouter.route('/', {
    name: 'home',
    action: () => {
        mount(App, {
            content: <Home />,
            redirect: 'false',
        });
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

FlowRouter.route('/hw', {
    name: 'hwtrack',
    action: () => {
        mount(App, {
            content: <HWTrack />,
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
