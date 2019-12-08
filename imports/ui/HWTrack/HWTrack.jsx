/* eslint-disable no-underscore-dangle */
import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Tracker } from 'meteor/tracker';
import { FlowRouter } from 'meteor/kadira:flow-router';
import propTypes from 'prop-types';

import {
    Typography, Row, Col,
} from 'antd';

import HWClass from '../../api/hw.class.db.js';

import HWTrackBox from './HWTrackBox.jsx';
import HWTrackClass from './HWTrackClass.jsx';
import HWTrackAddModal from './HWTrackAddModal.jsx';
import HWTrackAddClassModal from './HWTrackAddClassModal.jsx';

const { Title } = Typography;

class HWTrack extends Component {
    static propTypes = {
        classID: propTypes.string,
        hwClass: propTypes.arrayOf(propTypes.object),
    };

    static defaultProps = {
        classID: propTypes.string,
        hwClass: propTypes.arrayOf(propTypes.object),
    };

    constructor(props) {
        super(props);

        this.state = {
        };
    }

    componentDidMount() {
        Tracker.autorun(() => {
            const user = Meteor.user();
            if (user && !user.emails[0].verified) {
                FlowRouter._page.replace('/verify/reminder');
            }
        });
    }

    renderClassBox() {
        const { hwClass } = this.props;

        return hwClass.map(hwclass => (
            <HWTrackBox
                key={hwclass._id}
                classID={hwclass._id}
                className={hwclass.name}
                classCode={hwclass.code}
                classTeacher={hwclass.teacher}
                classRoom={hwclass.room}
                classURL={hwClass.url}
            />
        ));
    }

    render() {
        const { classID, hwClass } = this.props;
        if (classID === 'home') {
            return (
                <div>
                    <Title>
                        Homework Tracker
                    </Title>

                    <Row gutter={24}>
                        <Col span={4} offset={8}>
                            <HWTrackAddModal />
                        </Col>
                        <Col span={3}>
                            { hwClass.length >= 4
                                ? <HWTrackAddClassModal disabled classCount={hwClass.length} />
                                : <HWTrackAddClassModal classCount={hwClass.length} />
                            }
                        </Col>
                    </Row>

                    <br />

                    <Row gutter={16}>
                        {this.renderClassBox()}
                    </Row>
                </div>
            );
        }
        return (
            <div>
                <HWTrackClass classID={classID} />
            </div>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe('hwClass');
    return {
        hwClass: HWClass.find({
            userID: Meteor.userId(),
            isDeleted: false,
        }).fetch(),
    };
})(HWTrack);
