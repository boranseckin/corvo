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

    renderClassRow() {
        let { hwClass } = this.props;

        hwClass = hwClass.map(singleClass => (
            <HWTrackBox
                key={singleClass._id}
                classID={singleClass._id}
                className={singleClass.name}
                classCode={singleClass.code}
                classTeacher={singleClass.teacher}
                classRoom={singleClass.room}
                classURL={singleClass.url}
                backColor={singleClass.color}
            />
        ));

        let hwClassChunks = hwClass.reduce((reducedArray, item, index) => {
            const chunkIndex = Math.floor(index / 4);

            if (!reducedArray[chunkIndex]) {
                // eslint-disable-next-line no-param-reassign
                reducedArray[chunkIndex] = [];
            }

            reducedArray[chunkIndex].push(item);
            return reducedArray;
        }, []);

        hwClassChunks = hwClassChunks.map((chunk) => {
            const colKey1 = Math.random().toString(36).substring(2, 15);
            const colKey2 = Math.random().toString(36).substring(2, 15);
            const rowKey = Math.random().toString(36).substring(2, 15);

            chunk.unshift((<Col key={colKey1} span={2} />));
            chunk.push((<Col key={colKey2} span={2} />));

            const row = (
                <Row
                    key={rowKey}
                    gutter={16}
                    style={{ marginTop: '9px' }}
                >
                    {chunk}
                </Row>
            );

            return row;
        });

        return hwClassChunks;
    }

    render() {
        const { classID, hwClass } = this.props;
        if (classID === 'home') {
            return (
                <div>
                    <Title>
                        Homework Tracker
                    </Title>

                    <Row justify="center" type="flex" gutter={16}>
                        <Col span={4}>
                            <HWTrackAddModal />
                        </Col>
                        <Col span={3}>
                            <HWTrackAddClassModal classCount={hwClass.length} />
                        </Col>
                    </Row>

                    <br />

                    {this.renderClassRow()}
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
