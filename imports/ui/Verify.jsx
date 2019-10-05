import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Accounts } from 'meteor/accounts-base';
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
        };
    }

    componentDidMount() {
        const { token } = this.props;

        if (token) {
            this.verifyByToken(token);
        } else {
            this.sendVerificationEmail();
        }
    }

    verifyByToken() {
        const { token } = this.props;

        Accounts.verifyEmail(token, (error) => {
            if (!error) {
                this.setState({ pending: false });
                setTimeout(() => {
                    FlowRouter.go('/hw');
                }, 2000);
            } else if (error.reason === 'Verify email link expired') {
                message.error('This verification token is not valid!');
            }
        });
    }

    sendVerificationEmail() {
        const { userId } = this.props;

        Meteor.call('user.sendVerificationEmail', userId);
    }

    render() {
        const { pending } = this.state;
        if (pending) {
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
