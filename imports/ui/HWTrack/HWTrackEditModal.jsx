/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-underscore-dangle */
import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import propTypes from 'prop-types';
import { moment } from 'meteor/momentjs:moment';

import {
    Modal, Form, Input, Button, Radio, DatePicker, Select, Icon, message,
} from 'antd';

import HW from '../../api/hw.db';

const { Option } = Select;

const EditForm = Form.create({ name: 'editAssignmentForm' })(
    // eslint-disable-next-line
    class extends Component {
        static propTypes = {
            visible: propTypes.bool,
            onCancel: propTypes.func,
            onSubmit: propTypes.func,
            confirmLoading: propTypes.bool,
            classList: propTypes.arrayOf(propTypes.object),
            form: propTypes.objectOf(propTypes.any),
            hw: propTypes.object,
        };

        static defaultProps = {
            visible: false,
            onCancel: propTypes.func,
            onSubmit: propTypes.func,
            confirmLoading: false,
            classList: [],
            form: {},
            hw: {},
        };

        componentDidMount() {
            this.id = 0;
            this.initialPartner();
            this.setValues();
        }

        setValues = () => {
            const { form, hw } = this.props;

            if (hw) {
                form.setFieldsValue({
                    alias: hw.alias,
                    subject: hw.classID,
                    description: hw.description,
                    submitMethod: hw.submitMethod,
                    dueDate: moment(hw.dueDate, 'dddd, MMMM Do YYYY, h:mm:ss a'),
                });
            }
        }

        initialPartner = () => {
            const { hw } = this.props;

            hw.partners.forEach(() => {
                this.addPartner();
            });
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
            const nextKeys = keys.concat(this.id += 1);

            form.setFieldsValue({
                keys: nextKeys,
            });
        }

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
                visible, onCancel, onSubmit, form, confirmLoading, hw,
            } = this.props;

            const { getFieldDecorator, getFieldValue } = form;

            const aliasConfig = {
                rules: [{ required: true, message: 'Please input an alias for the assignment!' }],
            };

            const subjectConfig = {
                validateTrigger: ['onChange', 'onBlur'],
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
            const partnerForm = keys.map((k, index) => {
                const partner = hw.partners[index];
                return (
                    <Form.Item
                        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                        label={index === 0 ? 'Partner(s)' : ''}
                        required={false}
                        key={k}
                    >

                        {getFieldDecorator(`names[${k}]`, {
                            initialValue: partner,
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
                );
            });

            return (
                <Modal
                    title="Edit the assignment"
                    visible={visible}
                    onCancel={onCancel}
                    onOk={onSubmit}
                    maskClosable={false}
                    confirmLoading={confirmLoading}
                    okText="Submit"
                >
                    <Form {...formItemLayout} layout="horizontal" hideRequiredMark>

                        <Form.Item label="Alias">
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
                                <Input.TextArea rows={3} autosize={autoSizeConfig} />,
                            )}
                        </Form.Item>

                        <Form.Item label="Submit Method">
                            {getFieldDecorator('submitMethod', {
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

class HWTrackEditModal extends Component {
    static propTypes = {
        hws: propTypes.arrayOf(propTypes.object),
        fixModal: propTypes.func,
        editID: propTypes.string,
    };

    static defaultProps = {
        hws: propTypes.arrayOf(propTypes.object),
        fixModal: propTypes.func,
        editID: propTypes.string,
    };

    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            classList: [],
            confirmLoading: false,
            hw: null,
        };

        this._isMounted = false;
        this.handleCancel = this.handleCancel.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;

        this.getFieldData();
        this.returnClass();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    getFieldData = () => {
        const { hws, editID } = this.props;

        hws.forEach((element) => {
            if (element._id === editID && this._isMounted) {
                this.setState({
                    hw: element,
                    visible: true,
                });
            }
        });
    }

    handleCancel = (e) => {
        e.preventDefault();

        const { form } = this.formRef.props;

        this.setState({
            visible: false,
        }, () => form.resetFields());
    }

    handleSubmit = () => {
        const { hw } = this.state;
        const { fixModal } = this.props;
        const { form } = this.formRef.props;

        form.validateFields((err, values) => {
            if (err) {
                return;
            }

            const { keys, names } = values;

            const partners = keys.map(key => names[key]);
            const dueDate = values.dueDate.format('dddd, MMMM Do YYYY, h:mm:ss a');

            Meteor.call('hw.update',
                hw._id,
                values.alias,
                values.subject,
                dueDate,
                values.submitMethod,
                partners,
                values.description,
                (error) => {
                    if (error) {
                        message.error('The process was unsuccessful. Please try again!');
                        return;
                    }
                    message.success('The assignment was succesfully updated!');
                });

            this.setState({
                visible: false,
            }, () => form.resetFields());
            fixModal();
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
        const {
            visible, classList, confirmLoading, hw,
        } = this.state;

        if (hw) {
            return (
                <EditForm
                    wrappedComponentRef={this.saveFormRef}
                    visible={visible}
                    confirmLoading={confirmLoading}
                    classList={classList}
                    onCancel={this.handleCancel}
                    onSubmit={this.handleSubmit}
                    hw={hw}
                />
            );
        }
        return (<div />);
    }
}

export default withTracker(() => {
    Meteor.subscribe('hws');
    return {
        hws: HW.find({}).fetch(),
    };
})(HWTrackEditModal);
