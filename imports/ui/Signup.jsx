/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-underscore-dangle */
import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Tracker } from 'meteor/tracker';
import propTypes from 'prop-types';

import {
    Col, Row, Typography, Form, Input, Button, Icon,
} from 'antd';

const { Paragraph, Title } = Typography;

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
                    Meteor.call('user.insert', values.username, values.email, values.password);
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
                callback('Two passwords that you enter is inconsistent!');
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
                    <Form onSubmit={this.handleSubmit} className="signup-form">
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
                                rules: [{ required: true, message: 'Please input your email!' }],
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
                            <Button type="primary" htmlType="submit" className="signup-form-button">
                                Sign Up
                            </Button>
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
            user: null,
        };
    }

    componentDidMount() {
        Tracker.autorun(() => {
            this.setState({
                user: Meteor.userId(),
            });
        });
    }

    render() {
        const { user } = this.state;
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
                <Paragraph>
                    {user === null ? 'None' : user}
                </Paragraph>
            </div>
        );
    }
}
