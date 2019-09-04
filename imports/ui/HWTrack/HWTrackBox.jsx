import React, { Component } from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Tracker } from 'meteor/tracker';
import propTypes from 'prop-types';

import {
    Card, Col,
} from 'antd';

import HW from '../../api/hw.db.js';

class HWTrackBox extends Component {
    static propTypes = {
        classID: propTypes.string,
        className: propTypes.string,
        classCode: propTypes.string,
        classTeacher: propTypes.string,
        classRoom: propTypes.number,
    };

    static defaultProps = {
        classID: propTypes.string,
        className: propTypes.string,
        classCode: propTypes.string,
        classTeacher: propTypes.string,
        classRoom: propTypes.number,
    };

    constructor(props) {
        super(props);

        this.state = {
            cardLoading: true,
            activeHW: null,
        };

        this.handleCardClick = this.handleCardClick.bind(this);
    }

    componentDidMount() {
        const { classID } = this.props;

        this.tracker = Tracker.autorun(() => {
            if (classID) {
                const activeHW = HW.find({ classID }).count();
                this.setState({
                    activeHW,
                    cardLoading: false,
                });
            }
        });
    }

    componentWillUnmount() {
        this.tracker.stop();
    }

    handleCardClick(event) {
        event.preventDefault();

        const { className } = this.props;

        FlowRouter.go(`/hw/${className}`);
    }

    render() {
        const {
            className, classCode, classTeacher, classRoom,
        } = this.props;
        const { cardLoading, activeHW } = this.state;
        return (
            <Col span={6}>
                <Card title={className} hoverable="true" loading={cardLoading} onClick={this.handleCardClick}>
                    <p>
                        <b>Class Code:</b>
                        &nbsp;
                        {classCode}
                    </p>
                    <p>
                        <b>Teacher:</b>
                        &nbsp;
                        {classTeacher}
                    </p>
                    <p>
                        <b>Room Number:</b>
                        &nbsp;
                        {classRoom}
                    </p>
                    <p>
                        <b>Active Assignments:</b>
                        &nbsp;
                        {activeHW}
                    </p>
                </Card>
            </Col>
        );
    }
}

export default HWTrackBox;
