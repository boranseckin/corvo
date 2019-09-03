/* eslint-disable react/prop-types */
import React, { Component } from 'react';

import {
    Modal, Form, Input, Button, Radio, DatePicker,
} from 'antd';

const CreateForm = Form.create({ name: 'form_in_modal' })(
    // eslint-disable-next-line
    class extends Component {
        render() {
            const {
                visible, onCancel, onCreate, form,
            } = this.props;

            const { getFieldDecorator } = form;

            const dateConfig = {
                rules: [{ type: 'object', required: true, message: 'Please select time!' }],
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
                    <Form layout="vertical" hideRequiredMark>
                        <Form.Item label="Title">
                            {getFieldDecorator('title', {
                                rules: [{ required: true, message: 'Please input an alias for the assignment!' }],
                            })(<Input />)}
                        </Form.Item>
                        <Form.Item label="Due Date">
                            {getFieldDecorator('date-time-picker', dateConfig)(
                                <DatePicker showTime format="MM-DD-YYYY HH:mm:ss" />,
                            )}
                        </Form.Item>
                        <Form.Item label="Description">
                            {getFieldDecorator('description')(<Input type="textarea" />)}
                        </Form.Item>
                        <Form.Item label="Submit Method">
                            {getFieldDecorator('modifier', {
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

            console.log('Received values of form: ', values);
            form.resetFields();
            this.setState({ visible: false });
        });
    }

    saveFormRef = (formRef) => {
        this.formRef = formRef;
    };

    render() {
        const { visible } = this.state;
        return (
            <div>
                <Button icon="plus" size="large" shape="round" onClick={this.handleClick}>New Assignment</Button>

                <CreateForm
                    wrappedComponentRef={this.saveFormRef}
                    visible={visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleSubmit}
                />
            </div>
        );
    }
}
