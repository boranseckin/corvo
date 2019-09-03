/* eslint-disable no-underscore-dangle */
import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import propTypes from 'prop-types';

import {
    Modal, Form, Input, Button, Radio, DatePicker, Select,
} from 'antd';

const { Option } = Select;

const CreateForm = Form.create({ name: 'form_in_modal' })(
    // eslint-disable-next-line
    class extends Component {
        static propTypes = {
            visible: propTypes.bool,
            onCancel: propTypes.func,
            onCreate: propTypes.func,
            classList: propTypes.arrayOf(propTypes.object),
            form: propTypes.objectOf(propTypes.any),
        };

        static defaultProps = {
            visible: propTypes.bool,
            onCancel: propTypes.func,
            onCreate: propTypes.func,
            classList: propTypes.arrayOf(propTypes.object),
            form: propTypes.objectOf(propTypes.any),
        };

        renderOptions() {
            const { classList } = this.props;

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
                visible, onCancel, onCreate, form,
            } = this.props;

            const { getFieldDecorator } = form;

            const aliasConfig = {
                rules: [{ required: true, message: 'Please input an alias for the assignment!' }],
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


            return (
                <Modal
                    title="Create a new assignment"
                    visible={visible}
                    onCancel={onCancel}
                    onOk={onCreate}
                    maskClosable={false}
                    okText="Submit"
                >
                    <Form layout="horizontal" hideRequiredMark>

                        <Form.Item label="Alias">
                            {getFieldDecorator('alias', aliasConfig)(
                                <Input />,
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

                        <Form.Item label="Description">
                            {getFieldDecorator('description', descriptionConfig)(
                                <Input type="textarea" />,
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
    static propTypes = {
    };

    static defaultProps = {
    };

    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            classList: [],
        };

        this.handleClick = this.handleClick.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    componentDidMount() {
        this.returnClass();
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

            Meteor.call('hw.insert',
                values.alias,
                values.subject,
                values.dueDate._d,
                values.submitMethod,
                [],
                values.description);

            form.resetFields();
            this.setState({ visible: false });
        });
    }

    saveFormRef = (formRef) => {
        this.formRef = formRef;
    };

    returnClass = () => {
        Meteor.call('hw.class.list', (error, result) => {
            this.setState({ classList: result });
        });
    }

    render() {
        const { visible, classList } = this.state;
        return (
            <div>
                <Button icon="plus" size="large" shape="round" onClick={this.handleClick}>New Assignment</Button>

                <CreateForm
                    wrappedComponentRef={this.saveFormRef}
                    visible={visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleSubmit}
                    classList={classList}
                />
            </div>
        );
    }
}
