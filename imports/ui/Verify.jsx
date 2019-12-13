import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Accounts } from 'meteor/accounts-base';
import { Tracker } from 'meteor/tracker';
import * as RLocalStorage from 'meteor/simply:reactive-local-storage';
import { FlowRouter } from 'meteor/kadira:flow-router';
import propTypes from 'prop-types';

import {
    Result, message, Icon,
} from 'antd';

export default class Verify extends Component {
    static propTypes = {
        userId: propTypes.string,
        token: propTypes.string,
    };

    static defaultProps = {
        userId: null,
        token: null,
    };

    constructor(props) {
        super(props);

        this.state = {
            pending: true,
            notFound: false,
        };
    }

    componentDidMount() {
        const { token } = this.props;

        if (token) {
            this.verifyByToken(token);
        } else {
            this.sendVerificationEmail();
        }

        Tracker.autorun(() => {
            if (RLocalStorage.getItem('emailCallback')) {
                this.setState({ pending: false }, () => {
                    setTimeout(() => {
                        RLocalStorage.removeItem('emailCallback');
                        FlowRouter.go('/');
                    }, 2000);
                });
            }
        });
    }

    verifyByToken() {
        const { token } = this.props;

        Accounts.verifyEmail(token, (error) => {
            if (!error) {
                Meteor.call('track.newAction', Meteor.userId(), 'user.verifyEmail', Meteor.userId());

                this.setState({ pending: false });
                RLocalStorage.setItem('emailCallback', true);
                setTimeout(() => {
                    FlowRouter.go('/');
                }, 2000);
            } else if (error.reason === 'Verify email link expired') {
                message.error('This verification token is not valid!');
            }
        });
    }

    sendVerificationEmail() {
        const { userId } = this.props;

        if (userId !== 'reminder') {
            Meteor.call('user.sendVerificationEmail', userId, (error) => {
                if (error) {
                    if (error.reason === 'Can\'t find user') {
                        this.setState({ notFound: true });
                    } else if (error.reason === 'That user has no unverified email addresses.') {
                        this.setState({ pending: false });
                        setTimeout(() => {
                            FlowRouter.go('/hw');
                        }, 2000);
                    }
                }
                RLocalStorage.setItem('emailCallback', false);
            });
        }
    }

    render() {
        const { pending, notFound } = this.state;
        if (pending && !notFound) {
            return (
                <div>
                    <Result
                        icon={<Icon type="loading" />}
                        status="info"
                        title="Waiting for e-mail verification!"
                        subTitle="Please verify your e-mail address by clicking the link in the email we have sent you."
                    />
                </div>
            );
        }
        if (notFound) {
            return (
                <div>
                    <Result
                        status="error"
                        title="This user does not exist!"
                        subTitle="Please sign up to get a verification email."
                        extra={(
                            <a href="/signup">
                                Sign up
                                {' '}
                                <i className="material-icons" style={{ fontSize: '18px', verticalAlign: 'text-bottom' }}>launch</i>
                            </a>
                        )}
                    />
                </div>
            );
        }
        return (
            <div>
                <Result
                    status="success"
                    title="Account is successfully created and verified!"
                    subTitle="You will be redirected to the home page..."
                />
            </div>
        );
    }
}
