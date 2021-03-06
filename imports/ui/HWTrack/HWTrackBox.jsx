import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { withTracker } from 'meteor/react-meteor-data';
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
        classRoom: propTypes.string,
        backColor: propTypes.string,
        hws: propTypes.arrayOf(propTypes.object),
    };

    static defaultProps = {
        classID: propTypes.string,
        className: propTypes.string,
        classCode: propTypes.string,
        classTeacher: propTypes.string,
        classRoom: propTypes.string,
        backColor: '#fff',
        hws: propTypes.arrayOf(propTypes.object),
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
        const { classID, hws } = this.props;

        this.tracker = Tracker.autorun(() => {
            if (classID) {
                const activeHW = this.checkClassID(hws);
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

    checkClassID(hws) {
        const { classID } = this.props;
        let counter = 0;

        for (let i = 0; i < hws.length; i += 1) {
            if (hws[i].classID === classID) {
                counter += 1;
            }
        }

        return counter;
    }

    handleCardClick(event) {
        event.preventDefault();

        const { classID } = this.props;

        FlowRouter.go(`/hw/${classID}`);
    }

    render() {
        const {
            className,
            classCode,
            classTeacher,
            classRoom,
            backColor,
        } = this.props;
        const { cardLoading, activeHW } = this.state;

        let style = {};

        if (backColor !== '#fff') {
            style = { backgroundColor: backColor };
        }

        return (
            <Col span={5}>
                <Card
                    title={className}
                    hoverable="true"
                    loading={cardLoading}
                    onClick={this.handleCardClick}
                    headStyle={style}
                >
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

export default withTracker(() => {
    Meteor.subscribe('hws');
    return {
        hws: HW.find({
            isDeleted: false,
            isCompleted: false,
        }).fetch(),
    };
})(HWTrackBox);
