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
                    Meteor.loginWithPassword(values.username, values.password, () => {
                        form.resetFields();
                    });
                }
            });
        };

        render() {
            const { form } = this.props;
            const { getFieldDecorator } = form;
            return (
                <div>
                    <Form onSubmit={this.handleSubmit} className="login-form">
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
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                Log in
                            </Button>
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
                    <Col span={10} />
                    <Col span={4}>
                        <LoginForm />
                    </Col>
                    <Col span={10} />
                </Row>
                <Paragraph>
                    {user === null ? 'None' : user}
                </Paragraph>
            </div>
        );
    }
}
