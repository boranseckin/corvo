import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import propTypes from 'prop-types';
import {
    Typography, Row,
} from 'antd';

import HWClass from '../../api/hw.class.db.js';

import HWTrackBox from './HWTrackBox.jsx';
import HWTrackClass from './HWTrackClass.jsx';
import HWTrackAddModal from './HWTrackAddModal.jsx';

const { Title } = Typography;

class HWTrack extends Component {
    static propTypes = {
        className: propTypes.string,
        hwClass: propTypes.arrayOf(propTypes.object),
    };

    static defaultProps = {
        className: propTypes.string,
        hwClass: propTypes.arrayOf(propTypes.object),
    };

    constructor(props) {
        super(props);

        this.state = {
        };
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
            />
        ));
    }

    render() {
        const { className } = this.props;
        if (className === 'home') {
            return (
                <div>
                    <Title>
                        Homework Tracker
                    </Title>

                    <HWTrackAddModal />

                    <br />

                    <Row gutter={16}>
                        {this.renderClassBox()}
                    </Row>
                </div>
            );
        }
        return (
            <div>
                <Title>
                    Homework Tracker -
                    &nbsp;
                    {className}
                </Title>

                <HWTrackClass className={className} />
            </div>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe('hwClass');
    return {
        hwClass: HWClass.find({}).fetch(),
    };
})(HWTrack);
