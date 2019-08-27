/* eslint-disable jsx-a11y/anchor-is-valid */
import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { withAlert } from 'react-alert';
import propTypes from 'prop-types';

import {
    Button, Form, Input, Row, Col, Select,
} from 'antd';

const { Option } = Select;

class UrlShortForm extends Component {
    static propTypes = {
        alert: propTypes.objectOf(propTypes.any),
    };

    static defaultProps = {
        alert: propTypes.objectOf(propTypes.any),
    };

    constructor(props) {
        super(props);

        this.state = {
            inputUrlValue: '',
            inputNameValue: '',
            inputDurationValue: '1h',
        };

        this.handleUrlChange = this.handleUrlChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleDurationChange = this.handleDurationChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleUrlChange(event) {
        this.setState({ inputUrlValue: event.target.value });
    }

    handleNameChange(event) {
        this.setState({ inputNameValue: event.target.value });
    }

    handleDurationChange(event) {
        this.setState({ inputDurationValue: event });
    }

    handleSubmit(event) {
        event.preventDefault();

        const { alert } = this.props;
        const { inputNameValue, inputDurationValue } = this.state;
        let { inputUrlValue } = this.state;

        const regexp = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}|[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,})/;

        alert.remove(this.warn);

        if (!inputUrlValue) {
            this.warn = alert.info('URL is missing');
            return;
        }

        if (!regexp.test(inputUrlValue)) {
            this.warn = alert.info('URL is not valid');
            return;
        }

        if (!inputUrlValue.startsWith('http')) {
            inputUrlValue = `http://${inputUrlValue}`;
        }

        if (!inputNameValue) {
            this.warn = alert.info('Name is missing');
            return;
        }

        if (!inputDurationValue || inputDurationValue === 'Duration...') {
            this.warn = alert.info('Select a duration!');
            return;
        }

        Meteor.call('url.insert', inputUrlValue, inputNameValue, inputDurationValue);

        this.clearForm();
    }

    clearForm() {
        this.setState({
            inputUrlValue: '',
            inputNameValue: '',
        });
    }

    render() {
        const { inputUrlValue, inputNameValue } = this.state;
        return (
            <div>
                <Form layout="inline" onSubmit={this.handleSubmit}>
                    <Row type="flex" justify="center">
                        <Col span={10}>
                            <Form.Item>
                                <Input type="text" id="url-input" placeholder="URL" value={inputUrlValue} onChange={this.handleUrlChange} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item>
                                <Input type="text" id="name-input" placeholder="Name" value={inputNameValue} onChange={this.handleNameChange} />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item>
                                <Select defaultValue="1h" id="dur-select" style={{ width: 120 }} onChange={this.handleDurationChange}>
                                    <Option value="1h">1h</Option>
                                    <Option value="24h">24h</Option>
                                    <Option value="Unlimited">Unlimited</Option>
                                </Select>
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
            </div>
        );
    }
}

export default withAlert()(UrlShortForm);
