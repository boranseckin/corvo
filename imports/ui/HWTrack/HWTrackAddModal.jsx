/* eslint-disable no-underscore-dangle */
import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Tracker } from 'meteor/tracker';
import propTypes from 'prop-types';

import {
    Modal, Form, Input, Button, Radio, DatePicker, Select, Icon, message,
} from 'antd';

const { Option } = Select;
let id = 0;

const CreateForm = Form.create({ name: 'newAssignmentForm' })(
    // eslint-disable-next-line
    class extends Component {
        static propTypes = {
            visible: propTypes.bool,
            onCancel: propTypes.func,
            onCreate: propTypes.func,
            confirmLoading: propTypes.bool,
            form: propTypes.objectOf(propTypes.any),
        };

        static defaultProps = {
            visible: propTypes.bool,
            onCancel: propTypes.func,
            onCreate: propTypes.func,
            confirmLoading: propTypes.bool,
            form: propTypes.objectOf(propTypes.any),
        };

        constructor(props) {
            super(props);

            this.state = {
                classList: [],
            };
        }

        componentDidMount() {
            this.computation = Tracker.autorun(() => {
                Meteor.call('hw.class.list', Meteor.userId(), (error, result) => {
                    this.setState({ classList: result });
                });
            });
        }

        componentWillUnmount() {
            this.computation.stop();
        }

        removePartner = (k) => {
            const { form } = this.props;
            const keys = form.getFieldValue('keys');

            form.setFieldsValue({
                keys: keys.filter(key => key !== k),
            });
        }

        addPartner = () => {
            const { form } = this.props;
            const keys = form.getFieldValue('keys');
            const nextKeys = keys.concat(id += 1);

            form.setFieldsValue({
                keys: nextKeys,
            });
        }

        renderOptions() {
            const { classList } = this.state;

            return classList.map(a => (
                <Option key={a._id} value={a._id}>
                    {a.name}
                    &nbsp;
                    -
                    &nbsp;
                    {a.code}
                </Option>
            ));
        }

        render() {
            const {
                visible, onCancel, onCreate, form, confirmLoading,
            } = this.props;

            const { getFieldDecorator, getFieldValue } = form;

            const aliasConfig = {
                rules: [{ required: true, message: 'Please input a name for the assignment!' }],
            };

            const subjectConfig = {
                rules: [{ required: true, message: 'Please select a subject!' }],
            };

            const dateConfig = {
                rules: [{ type: 'object', required: true, message: 'Please select time!' }],
            };

            const descriptionConfig = {
                rules: [{ max: 300, message: 'Description cannot be longer than 300 characters!' }],
            };

            const autoSizeConfig = {
                minRows: 2,
                maxRows: 3,
            };

            const formItemLayout = {
                labelCol: {
                    xs: { span: 24 },
                    sm: { span: 6 },
                },
                wrapperCol: {
                    xs: { span: 24 },
                    sm: { span: 16 },
                },
            };

            const formItemLayoutWithOutLabel = {
                wrapperCol: {
                    xs: { span: 24, offset: 6 },
                    sm: { span: 16, offset: 6 },
                },
            };

            getFieldDecorator('keys', { initialValue: [] });
            const keys = getFieldValue('keys');
            const partnerForm = keys.map((k, index) => (
                <Form.Item
                    {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                    label={index === 0 ? 'Partner(s)' : ''}
                    required={false}
                    key={k}
                >

                    {getFieldDecorator(`names[${k}]`, {
                        validateTrigger: ['onChange', 'onBlur'],
                        rules: [
                            {
                                required: true,
                                whitespace: true,
                                message: "Please input partner's name or delete this field!",
                            },
                        ],
                    })(<Input placeholder="Partner name" style={{ width: '62%', marginRight: 8 }} />)}
                    <Icon
                        className="dynamic-delete-button"
                        type="minus-circle-o"
                        onClick={() => this.removePartner(k)}
                    />

                </Form.Item>
            ));

            return (
                <Modal
                    title="Create a new assignment"
                    visible={visible}
                    onCancel={onCancel}
                    onOk={onCreate}
                    maskClosable={false}
                    confirmLoading={confirmLoading}
                    okText="Submit"
                >

                    <Form {...formItemLayout} layout="horizontal" hideRequiredMark>

                        <Form.Item label="Name">
                            {getFieldDecorator('alias', aliasConfig)(
                                <Input autoFocus />,
                            )}
                        </Form.Item>

                        <Form.Item label="Subject">
                            {getFieldDecorator('subject', subjectConfig)(
                                <Select>
                                    {this.renderOptions()}
                                </Select>,
                            )}
                        </Form.Item>

                        <Form.Item label="Due Date">
                            {getFieldDecorator('dueDate', dateConfig)(
                                <DatePicker showTime format="MM-DD-YYYY HH:mm:ss" />,
                            )}
                        </Form.Item>

                        {partnerForm}

                        <Form.Item {...formItemLayoutWithOutLabel}>
                            <Button type="dashed" onClick={this.addPartner} style={{ width: '62%' }}>
                                <Icon type="plus" style={{ verticalAlign: 0 }} />
                                Add Partner
                            </Button>
                        </Form.Item>

                        <Form.Item label="Description">
                            {getFieldDecorator('description', descriptionConfig)(
                                <Input.TextArea rows={3} autoSize={autoSizeConfig} />,
                            )}
                        </Form.Item>

                        <Form.Item label="Submit Method">
                            {getFieldDecorator('submitMethod', {
                                initialValue: 'Paper',
                            })(
                                <Radio.Group>
                                    <Radio value="Paper">Paper</Radio>
                                    <Radio value="Classroom">Classroom</Radio>
                                </Radio.Group>,
                            )}
                        </Form.Item>

                    </Form>

                </Modal>
            );
        }
    },
);

export default class HWTrackModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            confirmLoading: false,
        };

        this.handleClick = this.handleClick.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    handleClick = (e) => {
        e.preventDefault();

        this.setState({
            visible: true,
        });
    }

    handleCancel = (e) => {
        e.preventDefault();

        const { form } = this.formRef.props;
        form.resetFields();
        this.setState({
            visible: false,
        });
    }

    handleSubmit = () => {
        const { form } = this.formRef.props;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }

            const { keys, names } = values;

            const partners = keys.map(key => names[key]);

            Meteor.call('hw.insert',
                values.alias,
                values.subject,
                values.dueDate.format('dddd, MMMM Do YYYY, h:mm:ss a'),
                values.submitMethod,
                partners,
                values.description,
                (error) => {
                    if (error) {
                        message.error('The process was unsuccessful. Please try again!');
                        return;
                    }
                    message.success('The assignment was succesfully added!');
                });

            this.setState({
                visible: false,
                confirmLoading: false,
            }, () => form.resetFields());
        });
    }

    saveFormRef = (formRef) => {
        this.formRef = formRef;
    };

    render() {
        const { visible, confirmLoading } = this.state;
        return (
            <div>
                <Button icon="plus" size="large" shape="round" onClick={this.handleClick}>New Assignment</Button>

                <CreateForm
                    wrappedComponentRef={this.saveFormRef}
                    visible={visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleSubmit}
                    confirmLoading={confirmLoading}
                />
            </div>
        );
    }
}
