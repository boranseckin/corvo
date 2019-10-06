import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import RememberMe from 'meteor/tprzytula:remember-me';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Tracker } from 'meteor/tracker';
import propTypes from 'prop-types';

import {
    Col, Row, Typography, Form, Input, Button, Icon, Checkbox, message,
} from 'antd';

const { Paragraph, Title } = Typography;

const LoginForm = Form.create({ name: 'loginForm' })(
    class extends React.Component {
        static propTypes = {
            form: propTypes.objectOf(propTypes.any),
        };

        static defaultProps = {
            form: propTypes.objectOf(propTypes.any),
        };

        handleSubmit = (e) => {
            e.preventDefault();

            const { form } = this.props;


            form.validateFields((err, values) => {
                if (!err) {
                    RememberMe.loginWithPassword(values.username, values.password, (error) => {
                        if (!error) {
                            form.resetFields();
                            message.success('You have been logged in!', 2, () => {
                                FlowRouter.go('/hw');
                            });
                        } else if (error.error === 403) {
                            message.error('Username or password is incorrect, please try again!');
                        }
                    }, values.remember);
                }
            });
        };

        render() {
            const { form } = this.props;
            const { getFieldDecorator } = form;
            return (
                <div>
                    <Form onSubmit={this.handleSubmit} className="login-form" style={{ maxWidth: '300px' }}>
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
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: 'Please input your Password!' }],
                            })(
                                <Input
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="Password"
                                    autoComplete="current-password"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: true,
                            })(<Checkbox style={{ float: 'left' }}>Remember me</Checkbox>)}
                            <a href="/forgot-password" style={{ float: 'right' }}>Forgot password?</a>
                            <Button type="primary" htmlType="submit" className="login-form-button" style={{ width: '100%' }}>
                                Log in
                            </Button>
                            <br />
                            You don&apos;t have an account?
                            &nbsp;
                            <a href="/signup">
                                Register
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

export default class Login extends Component {
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
                <Title>Login</Title>
                <Row gutter={24}>
                    <Col span={9} />
                    <Col span={6}>
                        <LoginForm />
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
