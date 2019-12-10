/* eslint-disable no-underscore-dangle */
import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import propTypes from 'prop-types';

import {
    Col, Row, Modal, Form, Input, Button, message,
} from 'antd';

const CreateForm = Form.create({ name: 'newClassForm' })(
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

        render() {
            const {
                visible, onCancel, onCreate, form, confirmLoading,
            } = this.props;

            const { getFieldDecorator } = form;

            const nameConfig = {
                rules: [{ required: true, message: 'Please input a name for the class!' }],
            };

            const codeConfig = {
                rules: [{
                    required: true, max: 9, message: 'Please input the class code!',
                }],
            };

            const teacherConfig = {
                rules: [{ required: true, message: 'Please input the teacher\'s name for the class!' }],
            };

            const roomConfig = {
                rules: [{
                    required: true, max: 3, message: 'Please input the room number of the class!',
                }],
            };

            const urlConfig = {
                rules: [{ required: false, type: 'url', message: 'Please input the classroom url!' }],
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

            return (
                <Modal
                    title="Create a new class"
                    visible={visible}
                    onCancel={onCancel}
                    onOk={onCreate}
                    maskClosable={false}
                    confirmLoading={confirmLoading}
                    okText="Submit"
                >

                    <Form {...formItemLayout} layout="horizontal">

                        <Form.Item label="Name">
                            {getFieldDecorator('name', nameConfig)(
                                <Input autoFocus />,
                            )}
                        </Form.Item>
                        <Row gutter={24}>
                            <Col span={10} style={{ marginLeft: '14.5%', paddingRight: '0px', paddingLeft: '0px' }}>
                                <Form.Item label="Code">
                                    {getFieldDecorator('code', codeConfig)(
                                        <Input style={{ width: '110px', marginLeft: '6.5px' }} />,
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={10} style={{ paddingLeft: '0px' }}>
                                <Form.Item label="Room" style={{ right: '5px' }}>
                                    {getFieldDecorator('room', roomConfig)(
                                        <Input style={{ width: '110px', left: '13.5px' }} />,
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item label="Teacher">
                            {getFieldDecorator('teacher', teacherConfig)(
                                <Input />,
                            )}
                        </Form.Item>

                        <Form.Item label="Classroom URL">
                            {getFieldDecorator('url', urlConfig)(
                                <Input />,
                            )}
                        </Form.Item>

                    </Form>

                </Modal>
            );
        }
    },
);

export default class HWTrackAddClassModal extends Component {
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

            Meteor.call('hw.class.insert',
                values.name,
                values.code,
                values.teacher,
                parseInt(values.room, 10),
                values.url,
                (error) => {
                    if (error) {
                        message.error('The process was unsuccessful. Please try again!');
                        return;
                    }
                    message.success('The class was succesfully added!');
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
                <Button icon="plus" size="large" shape="round" onClick={this.handleClick}>
                    New Class
                </Button>

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
