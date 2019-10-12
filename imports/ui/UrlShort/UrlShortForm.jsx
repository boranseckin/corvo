import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import propTypes from 'prop-types';

import {
    Button, Form, Input, Row, Col, Select,
} from 'antd';

const { Option } = Select;

class URLCreateForm extends Component {
    static propTypes = {
        form: propTypes.objectOf(propTypes.any),
    }

    static defaultProps = {
        form: propTypes.objectOf(propTypes.any),
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { form } = this.props;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            Meteor.call('url.insert', values.url, values.name, values.duration);
        });
    }

    render() {
        const { form } = this.props;
        const {
            getFieldDecorator,
            getFieldError,
            isFieldTouched,
        } = form;

        const urlError = isFieldTouched('url') && getFieldError('url');
        const nameError = isFieldTouched('name') && getFieldError('name');

        const urlConfig = {
            rules: [{ required: true, type: 'url', message: 'Please input a valid URL!' }],
            validateTrigger: 'onBlur',
        };

        const nameConfig = {
            rules: [{ required: true, message: 'Please input a name!' }],
            validateTrigger: 'onBlur',
        };

        const durationConfig = {
            rules: [{
                required: true,
                message: 'Please select a duration!',
            }],
            validateTrigger: 'onBlur',
        };

        return (
            <Form layout="inline" onSubmit={this.handleSubmit}>
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item validateStatus={urlError ? 'error' : ''} help={urlError || ''}>
                            {getFieldDecorator('url', urlConfig)(
                                <Input
                                    placeholder="URL"
                                />,
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={7}>
                        <Form.Item validateStatus={nameError ? 'error' : ''} help={nameError || ''}>
                            {getFieldDecorator('name', nameConfig)(
                                <Input
                                    placeholder="Name"
                                />,
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={3}>
                        <Form.Item>
                            {getFieldDecorator('duration', durationConfig)(
                                <Select placeholder="Duration">
                                    <Option value="1h">1h</Option>
                                    <Option value="24h">24h</Option>
                                    <Option value="Unlimited">Unlimited</Option>
                                </Select>,
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={2}>
                        <Form.Item>
                            <Button type="primary" onClick={this.handleSubmit}>
                                <i id="icon" className="material-icons">add</i>
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        );
    }
}

const URLForm = Form.create({ name: 'url_add' })(URLCreateForm);

export default class UrlShortForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    render() {
        return (
            <URLForm />
        );
    }
}
