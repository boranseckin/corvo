import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Accounts } from 'meteor/accounts-base';
import { FlowRouter } from 'meteor/kadira:flow-router';
import propTypes from 'prop-types';

import {
    Result, Icon, Form, Input, Button, Typography,
} from 'antd';

const { Title } = Typography;

const ResetForm = Form.create({ name: 'resetForm' })(
    class extends React.Component {
        static propTypes = {
            form: propTypes.objectOf(propTypes.any),
            onSubmit: propTypes.func,
        };

        static defaultProps = {
            form: propTypes.objectOf(propTypes.any),
            onSubmit: null,
        };

        constructor(props) {
            super(props);

            this.state = {
                confirmDirty: false,
                disabled: false,
            };
        }

        handleSubmit = (e) => {
            e.preventDefault();

            const { form, onSubmit } = this.props;

            form.validateFields((err, values) => {
                if (!err) {
                    this.setState({ disabled: true });
                    onSubmit(values.password);
                }
            });
        };

        handleConfirmBlur = (e) => {
            const { confirmDirty } = this.state;
            const { value } = e.target;
            this.setState({ confirmDirty: confirmDirty || !!value });
        };

        compareToFirstPassword = (rule, value, callback) => {
            const { form } = this.props;
            if (value && value !== form.getFieldValue('password')) {
                callback('Two passwords do not match!');
            } else {
                callback();
            }
        };

        validateToNextPassword = (rule, value, callback) => {
            const { form } = this.props;
            const { confirmDirty } = this.state;
            if (value && confirmDirty) {
                form.validateFields(['confirm'], { force: true });
            }
            callback();
        };

        render() {
            const { form } = this.props;
            const { getFieldDecorator } = form;
            const { disabled } = this.state;

            return (
                <div>
                    <Form onSubmit={this.handleSubmit} className="login-form" style={{ maxWidth: '300px' }}>
                        <Form.Item>
                            {getFieldDecorator('password', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please input your new password!',
                                    },
                                    {
                                        validator: this.validateToNextPassword,
                                    },
                                ],
                                validateTrigger: 'onBlur',
                            })(
                                <Input.Password
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="New Password"
                                    autoComplete="new-password"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('confirmPassword', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please confirm your new password!',
                                    },
                                    {
                                        validator: this.compareToFirstPassword,
                                    },
                                ],
                                validateTrigger: 'onBlur',
                            })(
                                <Input.Password
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="Confirm New Password"
                                    autoComplete="new-password"
                                    onBlur={this.handleConfirmBlur}
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="signup-form-button" disabled={disabled} style={{ width: '100%' }}>
                                Reset password
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            );
        }
    },
);

export default class ResetPassword extends Component {
    static propTypes = {
        token: propTypes.string,
    };

    static defaultProps = {
        token: null,
    };

    constructor(props) {
        super(props);

        this.state = {
            success: false,
            tokenIsValid: false,
            reason: null,
        };

        this.resetPassword = this.resetPassword.bind(this);
    }

    componentDidMount() {
        const { token } = this.props;

        if (token !== null) {
            this.checkToken();
        }
    }

    checkToken() {
        const { token } = this.props;

        Meteor.call('user.checkResetToken', token, (error) => {
            if (!error) {
                this.setState({ tokenIsValid: true });
            } else if (error.reason === 'Token is not valid!') {
                this.setState({ reason: 'notValid' });
            } else if (error.reason === 'Token is expired!') {
                this.setState({ reason: 'expired' });
            }
        });
    }

    resetPassword(password) {
        const { token } = this.props;

        Accounts.resetPassword(token, password, (error) => {
            if (!error) {
                this.setState({ success: true });
                setTimeout(() => {
                    FlowRouter.go('/login');
                }, 2000);
            }
        });
    }

    render() {
        const { tokenIsValid, reason, success } = this.state;

        if (!tokenIsValid && !reason) {
            return (
                <div>
                    <Result
                        icon={<Icon type="loading" />}
                        status="info"
                        title="Waiting for password recovery link!"
                        subTitle="Please recover your password by clicking the link in the email we have sent you."
                    />
                </div>
            );
        }
        if (reason === 'notValid') {
            return (
                <div>
                    <Result
                        status="error"
                        title="This recovery link is not valid!"
                        subTitle="Please make sure you clicked the right link or send a new link by submitting another forgot password form."
                        extra={(
                            <a href="/forgot-password">
                                Forgot Password
                                {' '}
                                <i className="material-icons" style={{ fontSize: '18px', verticalAlign: 'text-bottom' }}>launch</i>
                            </a>
                        )}
                    />
                </div>
            );
        }
        if (reason === 'expired') {
            return (
                <div>
                    <Result
                        status="error"
                        title="This recovery link is expired!"
                        subTitle="Please recover your password by submitting another forgot password form."
                        extra={(
                            <a href="/forgot-password">
                                Forgot Password
                                {' '}
                                <i className="material-icons" style={{ fontSize: '18px', verticalAlign: 'text-bottom' }}>launch</i>
                            </a>
                        )}
                    />
                </div>
            );
        }
        if (tokenIsValid && !success) {
            return (
                <div>
                    <Title>Reset Password</Title>
                    <ResetForm onSubmit={this.resetPassword} />
                </div>
            );
        }
        return (
            <div>
                <Result
                    status="success"
                    title="Account password is successfully changed!"
                    subTitle="You will be redirected to the login page..."
                />
            </div>
        );
    }
}
