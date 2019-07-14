import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import propTypes from 'prop-types';

import URL from '../api/url.db.js';

export default class UrlRedirect extends Component {
    static propTypes = {
        param: propTypes.string,
    };

    static defaultProps = {
        param: propTypes.string,
    };

    constructor(props) {
        super(props);

        this.state = {
            direction: '',
            noRoute: false,
        };
    }

    componentDidMount() {
        this.findRealUrl();
    }

    findRealUrl() {
        const { param } = this.props;

        const timeout = Meteor.setTimeout(() => {
            this.setState({ noRoute: true });
        }, 2500);

        Tracker.autorun(() => {
            Meteor.subscribe('urls');

            const query = URL.findOne({ shortUrl: param });

            if (query) {
                Meteor.clearTimeout(timeout);
                this.setState({ direction: query.realUrl });
                this.redirect();
            }
        });
    }

    redirect() {
        const { direction } = this.state;

        window.location.replace(direction);
    }

    render() {
        const { direction, noRoute } = this.state;

        if (noRoute) {
            return (
                <div>
                    <h4>
                        No route found on this address!
                        <br />
                        Click&nbsp;
                        <a href="/url">here</a>
                        &nbsp;to go back.
                    </h4>
                </div>
            );
        }

        return (
            <div>
                <h4>
                    Redirecting&nbsp;
                    <div className="spinner-border text-warning" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                    <br />
                    {direction}
                </h4>
            </div>
        );
    }
}
