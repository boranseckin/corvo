/* eslint-disable no-underscore-dangle */
import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Tracker } from 'meteor/tracker';
import propTypes from 'prop-types';

import {
    Table,
    Row,
    Col,
    Divider,
    Button,
    Descriptions,
    Popconfirm,
} from 'antd';

import HWClass from '../../api/hw.class.db.js';
import HW from '../../api/hw.db.js';

export default class HWTrackClass extends Component {
    static propTypes = {
        className: propTypes.string,
    };

    static defaultProps = {
        className: propTypes.string,
    };

    constructor(props) {
        super(props);

        this.state = {
            currentClass: {},
            activeHW: [],
        };

        this.handleCheck = this.handleCheck.bind(this);
    }

    componentDidMount() {
        const { className } = this.props;

        Tracker.autorun(() => {
            Meteor.subscribe('hwClassOne', className);
            Meteor.subscribe('hws');

            const currentClass = HWClass.find({ name: className }).fetch()[0];

            if (currentClass) {
                const activeHW = HW.find({ classID: currentClass._id, isCompleted: false }).fetch();
                this.setState({
                    currentClass,
                    activeHW,
                });
            }
        });
    }

    handleCheck = (value) => {
        Meteor.call('hw.complete', value.id);
    }

    calculateDateDiff = (due) => {
        const msPerDay = 1000 * 60 * 60 * 24;
        const date = new Date();

        return Math.floor((due - date) / msPerDay + 1);
    }

    createFormDate() {
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
            const hwData = {
                key: this.data.length + 1,
                id: hw._id,
                alias: hw.alias,
                submitMethod: hw.submitMethod,
                dueDate: hw.dueDate.toString(),
                daysLeft: this.calculateDateDiff(hw.dueDate),
                description: hw.description,
                partners: partnerString,
                createdAt: hw.createdAt._d.toString(),
            };
            this.data.push(hwData);
            return hwData;
        });
    }

    render() {
        const { currentClass, activeHW } = this.state;

        const columns = [
            {
                title: 'Alias',
                dataIndex: 'alias',
                key: 'alias',
            },
            {
                title: 'Submit Method',
                dataIndex: 'submitMethod',
                key: 'submitMethod',
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
                        <Button icon="edit" shape="round" />
                        <Divider type="vertical" />
                        <Popconfirm
                            title="Are you sure to complete this task?"
                            onConfirm={() => this.handleCheck(record)}
                        >
                            <Button icon="check" shape="round" />
                        </Popconfirm>
                    </span>
                ),
            },
        ];

        if (currentClass) {
            this.createFormDate();
            return (
                <div>
                    <p>
                        <b>Class Code:</b>
                        &nbsp;
                        {currentClass.code}
                    </p>
                    <p>
                        <b>Teacher:</b>
                        &nbsp;
                        {currentClass.teacher}
                    </p>
                    <p>
                        <b>Room Number:</b>
                        &nbsp;
                        {currentClass.room}
                    </p>
                    <p>
                        <b>Active Assignements:</b>
                        &nbsp;
                        {activeHW.length}
                    </p>
                    <br />
                    <Row>
                        <Col span={4} />
                        <Col span={16}>
                            <Table
                                columns={columns}
                                expandedRowRender={record => (
                                    <Descriptions layout="vertical">
                                        <Descriptions.Item label="Partners" span={1}>{record.partners}</Descriptions.Item>
                                        <Descriptions.Item label="Created At" span={2}>{record.createdAt}</Descriptions.Item>
                                        <Descriptions.Item label="Description">{record.description}</Descriptions.Item>
                                    </Descriptions>
                                )}
                                dataSource={this.data}
                                pagination={false}
                            />
                        </Col>
                        <Col span={4} />
                    </Row>
                </div>
            );
        }
        return (
            <div />
        );
    }
}
