import React, { Component } from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Tracker } from 'meteor/tracker';
import propTypes from 'prop-types';

import {
    Card, Col,
} from 'antd';

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
        };

        this.handleCardClick = this.handleCardClick.bind(this);
    }

    componentDidMount() {
        const { classID } = this.props;

        Tracker.autorun(() => {
            if (classID) {
                this.setState({
                    cardLoading: false,
                });
            }
        });
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
        const { cardLoading } = this.state;
        return (
            <Col span={6}>
                <Card title={className} hoverable="true" loading={cardLoading} onClick={this.handleCardClick}>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Morbi auctor aliquam ipsum vel finibus.
                    </p>
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
                </Card>
            </Col>
        );
    }
}

export default HWTrackBox;
