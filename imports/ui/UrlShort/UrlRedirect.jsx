import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import propTypes from 'prop-types';

import antd from 'antd';

import URL from '../../api/url.db.js';

const { Spin, Icon, Typography } = antd;

const { Paragraph, Title } = Typography;

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
                    <Title level={2}>
                        No route found on this address!
                    </Title>
                    <Paragraph style={{ fontSize: 24 }}>
                        Click&nbsp;
                        <a href="/url">here</a>
                        &nbsp;to go back.
                    </Paragraph>
                </div>
            );
        }

        return (
            <div>
                <Paragraph style={{ fontSize: 24 }}>
                    Redirecting...&nbsp;
                    <Spin indicator={(<Icon type="loading" style={{ fontSize: 24 }} spin />)} />
                    <br />
                    {direction}
                </Paragraph>
            </div>
        );
    }
}
