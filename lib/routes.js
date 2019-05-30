import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { mount } from 'react-mounter';

import App from '../imports/ui/App.jsx';
import Home from '../imports/ui/Home.jsx';
import UrlShort from '../imports/ui/UrlShort.jsx';
import UrlRedirect from '../imports/ui/UrlRedirect.jsx';
import RouteNotFound from '../imports/ui/RouteNotFound.jsx';

FlowRouter.route('/', {
    name: 'home',
    action: () => {
        mount(App, {
            content: <Home />,
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

FlowRouter.notFound = {
    action: () => {
        mount(App, {
            content: <RouteNotFound />,
        });
    },
};
