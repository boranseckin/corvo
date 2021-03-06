/* eslint-disable no-underscore-dangle */
import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Tracker } from 'meteor/tracker';
import { FlowRouter } from 'meteor/kadira:flow-router';
import propTypes from 'prop-types';
import { moment } from 'meteor/momentjs:moment';

import {
    Table,
    Row,
    Col,
    Divider,
    Button,
    Descriptions,
    Popconfirm,
    Badge,
    message,
    Typography,
    Icon,
} from 'antd';

import HWTrackEditModal from './HWTrackEditModal.jsx';

import HWClass from '../../api/hw.class.db.js';
import HW from '../../api/hw.db.js';

const { Paragraph, Title } = Typography;

export default class HWTrackClass extends Component {
    static propTypes = {
        classID: propTypes.string,
    };

    static defaultProps = {
        classID: propTypes.string,
    };

    constructor(props) {
        super(props);

        this.state = {
            currentClass: {},
            activeHW: [],
            editHW: null,
        };

        this.handleCheck = this.handleCheck.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidMount() {
        const { classID } = this.props;

        this.tracker = Tracker.autorun(() => {
            Meteor.subscribe('hwClassOne', classID);
            Meteor.subscribe('hws');

            const currentClass = HWClass.find({
                _id: classID,
                userID: Meteor.userId(),
                isDeleted: false,
            }).fetch()[0];

            if (currentClass) {
                const activeHW = HW.find({
                    classID: currentClass._id,
                    userID: Meteor.userId(),
                    isCompleted: false,
                    isDeleted: false,
                }).fetch();
                this.setState({
                    currentClass,
                    activeHW,
                });
            }
        });
    }

    componentWillUnmount() {
        this.tracker.stop();
    }

    handleCheck = (value) => {
        Meteor.call('hw.complete', value.id, (error) => {
            if (error) {
                message.error('The process was unsuccessful. Please try again!');
                return;
            }
            message.success('The assignment was succesfully completed!');
        });
    }

    handleEdit = (value) => {
        this.setState({
            editHW: value.id,
        });
    }

    handleDelete = (value) => {
        Meteor.call('hw.remove', value.id, (error) => {
            if (error) {
                message.error('The process was unsuccessful. Please try again!');
                return;
            }
            message.success('The assignment was succesfully deleted!');
        });
    }

    handleDeleteClass = () => {
        const { currentClass } = this.state;
        Meteor.call('hw.class.remove', currentClass._id);
        FlowRouter.go('/hw/');
    }

    fixModal = () => {
        this.setState({
            editHW: null,
        });
    }

    calculateDateDiff = due => due.diff(moment(), 'hours');

    createFormData() {
        const { activeHW } = this.state;

        this.data = [];

        activeHW.map((hw) => {
            let partnerString = '';
            for (let i = 0; i < hw.partners.length; i += 1) {
                if (i === hw.partners.length - 1) {
                    partnerString += `${hw.partners[i]}`;
                } else {
                    partnerString += `${hw.partners[i]}, `;
                }
            }

            const createdAt = moment(hw.createdAt, 'dddd, MMMM Do YYYY, h:mm:ss a');
            const dueDate = moment(hw.dueDate, 'dddd, MMMM Do YYYY, h:mm:ss a');
            const diff = this.calculateDateDiff(dueDate);

            let badge;

            if (diff >= 42) {
                badge = <Badge status="processing" text="Active" />;
            } else if (diff < 42 && diff >= 24) {
                badge = <Badge status="warning" text="Due Tomorrow" />;
            } else if (diff < 24 && diff >= 0) {
                badge = <Badge status="warning" text="Due Today" />;
            } else {
                badge = <Badge status="error" text="Late" />;
            }

            const hwData = {
                key: this.data.length + 1,
                id: hw._id,
                status: badge,
                alias: hw.alias,
                submitMethod: hw.submitMethod,
                dueDate: dueDate.format('ddd, MMM Do YYYY, h:mm:ss A'),
                daysLeft: Math.floor(diff / 24),
                description: hw.description,
                partners: partnerString,
                createdAt: createdAt.format('ddd, MMM Do YYYY, h:mm:ss A'),
            };

            this.data.push(hwData);
            return hwData;
        });
    }

    render() {
        const {
            currentClass, activeHW, editHW,
        } = this.state;

        const columns = [
            {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
            },
            {
                title: 'Name',
                dataIndex: 'alias',
                key: 'alias',
            },
            {
                title: 'Due Date',
                dataIndex: 'dueDate',
                key: 'dueDate',
            },
            {
                title: 'Days Left',
                dataIndex: 'daysLeft',
                key: 'daysLeft',
            },
            {
                title: 'Action',
                key: 'action',
                render: (text, record) => (
                    <span>
                        <Button icon="edit" shape="round" onClick={() => this.handleEdit(record)} />

                        <Divider type="vertical" />

                        <Popconfirm
                            title="Are you sure to complete this task?"
                            onConfirm={() => this.handleCheck(record)}
                        >
                            <Button icon="check" shape="round" />
                        </Popconfirm>

                        <Divider type="vertical" />

                        <Popconfirm
                            title="Are you sure to delete this task?"
                            onConfirm={() => this.handleDelete(record)}
                        >
                            <Button icon="delete" shape="round" />
                        </Popconfirm>
                    </span>
                ),
            },
        ];

        if (currentClass.code) {
            this.createFormData();
            return (
                <div>
                    <Title>{currentClass.name}</Title>
                    <Paragraph>
                        <b>Class Code:</b>
                        &nbsp;
                        {currentClass.code}
                        &nbsp;
                        { currentClass.url
                            ? <a href={currentClass.url} rel="noopener noreferrer" target="_blank"><Icon type="link" /></a>
                            : <p />
                        }
                    </Paragraph>
                    <Paragraph>
                        <b>Teacher:</b>
                        &nbsp;
                        {currentClass.teacher}
                    </Paragraph>
                    <Paragraph>
                        <b>Room Number:</b>
                        &nbsp;
                        {currentClass.room}
                    </Paragraph>
                    <Paragraph>
                        <b>Active Assignements:</b>
                        &nbsp;
                        {activeHW.length}
                    </Paragraph>
                    <br />
                    <Row>
                        <Col span={3} />
                        <Col span={18}>
                            <Table
                                columns={columns}
                                expandedRowRender={record => (
                                    <div>
                                        <Descriptions layout="vertical">
                                            <Descriptions.Item label="Partners" span={1}>{record.partners}</Descriptions.Item>
                                            <Descriptions.Item label="Submit Method" span={1}>{record.submitMethod}</Descriptions.Item>
                                            <Descriptions.Item label="Created At" span={1}>{record.createdAt}</Descriptions.Item>
                                            <Descriptions.Item label="Description" span={3}>{record.description}</Descriptions.Item>
                                        </Descriptions>
                                    </div>
                                )}
                                dataSource={this.data}
                                pagination={false}
                            />
                        </Col>
                        <Col span={3} />
                    </Row>
                    <br />
                    <Popconfirm
                        title="Are you sure to delete this class? (ﾉﾟ0ﾟ)ﾉ~"
                        onConfirm={this.handleDeleteClass}
                    >
                        <Button type="danger" icon="delete">Remove Class</Button>
                    </Popconfirm>
                    <HWTrackEditModal
                        key={Math.random()}
                        editID={editHW}
                        fixModal={this.fixModal}
                    />
                </div>
            );
        }
        return (
            <div />
        );
    }
}
