import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import propTypes from 'prop-types';

import {
    Col, Row, Typography, Form, Input, Button, Icon, message,
} from 'antd';

const { Title } = Typography;

const SignupForm = Form.create({ name: 'signupForm' })(
    class extends React.Component {
        static propTypes = {
            form: propTypes.objectOf(propTypes.any),
        };

        static defaultProps = {
            form: propTypes.objectOf(propTypes.any),
        };

        state = {
            confirmDirty: false,
        }

        handleSubmit = (e) => {
            e.preventDefault();
            const { form } = this.props;
            form.validateFields((err, values) => {
                if (!err) {
                    Meteor.call('user.insert', values.username, values.email, values.password, (error, result) => {
                        if (!error) {
                            form.resetFields();

                            message.success('You have been signed up successfully!', 2, () => {
                                FlowRouter.go(`/verify/${result}`);
                            });
                        } else if (error.reason === 'Username already exists.') {
                            message.error('This username is already exist, please try a different username!', 3);
                        } else if (error.reason === 'Email already exists.') {
                            message.error('This email is already registered for another account, please try a different email!', 3);
                        }
                    });
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
            return (
                <div>
                    <Form onSubmit={this.handleSubmit} className="signup-form" style={{ maxWidth: '300px' }}>
                        <Form.Item>
                            {getFieldDecorator('username', {
                                rules: [{ required: true, message: 'Please input your username!' }],
                            })(
                                <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="Username"
                                    autoComplete="username"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('email', {
                                rules: [
                                    { required: true, message: 'Please input your email!' },
                                    { type: 'email', message: 'Please input a valid email!' },
                                ],
                                validateTrigger: 'onBlur',
                            })(
                                <Input
                                    prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="Email"
                                    autoComplete="email"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('password', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please input your password!',
                                    },
                                    {
                                        validator: this.validateToNextPassword,
                                    },
                                ],
                                validateTrigger: 'onBlur',
                            })(
                                <Input.Password
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="Password"
                                    autoComplete="new-password"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('confirmPassword', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please confirm your password!',
                                    },
                                    {
                                        validator: this.compareToFirstPassword,
                                    },
                                ],
                                validateTrigger: 'onBlur',
                            })(
                                <Input.Password
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="Confirm Password"
                                    autoComplete="new-password"
                                    onBlur={this.handleConfirmBlur}
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="signup-form-button" style={{ width: '95%' }}>
                                Sign Up
                            </Button>
                            <br />
                            Do you already have an account?
                            &nbsp;
                            <a href="/login">
                                Login
                                {' '}
                                <i className="material-icons" style={{ fontSize: '18px', verticalAlign: 'text-bottom' }}>launch</i>
                            </a>
                        </Form.Item>
                    </Form>
                </div>
            );
        }
    },
);

export default class Signup extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    render() {
        return (
            <div>
                <Title>Sign Up</Title>
                <Row gutter={24}>
                    <Col span={9} />
                    <Col span={6}>
                        <SignupForm />
                    </Col>
                    <Col span={9} />
                </Row>
            </div>
        );
    }
}
