import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Accounts } from 'meteor/accounts-base';
import { FlowRouter } from 'meteor/kadira:flow-router';
import propTypes from 'prop-types';

import {
    Result, Button, Input, message, Icon,
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
            inputVal: '',
            pending: true,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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

    handleChange(e) {
        this.setState({
            inputVal: e.target.value,
        });
    }

    handleSubmit(e) {
        e.preventDefault();

        const { inputVal } = this.state;
        console.log(inputVal);
    }

    render() {
        const { inputVal, pending } = this.state;
        if (pending) {
            return (
                <div>
                    <Result
                        icon={<Icon type="loading" />}
                        status="info"
                        title="Waiting for e-mail verification!"
                        subTitle="Please verify your e-mail address by entering the code below or directly clicking the link."
                        extra={[
                            <Input value={inputVal} onPressEnter={this.handleSubmit} onChange={this.handleChange} style={{ maxWidth: '150px' }} />,
                            <Button type="primary" onClick={this.handleSubmit} key="verify">Verify</Button>,
                        ]}
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
