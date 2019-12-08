import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import propTypes from 'prop-types';

import {
    Col, Row, Typography, Form, Input, Button, Icon, message,
} from 'antd';

const { Title } = Typography;

const ForgotPasswordForm = Form.create({ name: 'forgotPasswordForm' })(
    class extends React.Component {
        static propTypes = {
            form: propTypes.objectOf(propTypes.any),
        };

        static defaultProps = {
            form: propTypes.objectOf(propTypes.any),
        };

        constructor(props) {
            super(props);

            this.state = {
                button: true,
                loading: false,
            };
        }

        handleSubmit = (e) => {
            e.preventDefault();

            this.setState({ button: false, loading: true });

            const { form } = this.props;
            form.validateFields((err, values) => {
                if (!err) {
                    Accounts.forgotPassword({ email: values.email }, (error) => {
                        if (!error) {
                            Meteor.call('user.forgotPassword', values.email);
                            message.success('The recovery link has been sent to your email!');
                            this.setState({ button: false, loading: false });
                        } else {
                            message.error('This email is not related to any registered account!');
                            this.setState({ button: true, loading: false });
                        }
                    });
                }
            });
        };

        render() {
            const { button, loading } = this.state;
            const { form } = this.props;
            const { getFieldDecorator } = form;
            return (
                <div>
                    <Form onSubmit={this.handleSubmit} className="login-form" style={{ maxWidth: '300px' }}>
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
                            <Button type="primary" htmlType="submit" className="login-form-button" disabled={!button} loading={loading} style={{ width: '100%' }}>
                                {button ? 'Send recovery email' : 'Recovery email is sent'}
                            </Button>
                            <br />
                            Did you magically remember your password?
                            <br />
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

export default class ForgotPassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    render() {
        return (
            <div>
                <Title>Forgot Password</Title>
                <Row gutter={24}>
                    <Col span={9} />
                    <Col span={6}>
                        <ForgotPasswordForm />
                    </Col>
                    <Col span={9} />
                </Row>
            </div>
        );
    }
}
