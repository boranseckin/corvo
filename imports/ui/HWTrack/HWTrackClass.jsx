/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable array-callback-return */
/* eslint-disable class-methods-use-this */
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

    calculateDateDiff(due) {
        const msPerDay = 1000 * 60 * 60 * 24;
        const date = new Date();

        return Math.floor((due - date) / msPerDay + 1);
    }

    createFormDate() {
        const { activeHW } = this.state;

        this.data = [];

        activeHW.map((hw) => {
            const hwData = {
                key: this.data.length + 1,
                alias: hw.alias,
                submitMethod: hw.submitMethod,
                dueDate: hw.dueDate.toUTCString(),
                daysLeft: this.calculateDateDiff(hw.dueDate),
                description: hw.description,
                partners: hw.partners,
                createdAt: hw.createdAt.toUTCString(),
            };
            this.data.push(hwData);
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
                        <Button icon="check" shape="round" />
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
                                expandRowByClick
                                expandedRowRender={record => (
                                    <Descriptions>
                                        <Descriptions.Item label="Partners">{record.partners}</Descriptions.Item>
                                        <Descriptions.Item label="Created At">{record.createdAt}</Descriptions.Item>
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
