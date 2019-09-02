import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import propTypes from 'prop-types';
import {
    Typography, Row, Button,
} from 'antd';

import HWClass from '../../api/hw.class.db.js';

import HWTrackBox from './HWTrackBox.jsx';
import HWTrackClass from './HWTrackClass.jsx';
import HWTrackModal from './HWTrackModal.jsx';

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
            modal: false,
        };

        this.handleClick = this.handleClick.bind(this);
        this.handleModalCancel = this.handleModalCancel.bind(this);
    }

    handleClick = (e) => {
        e.preventDefault();
        this.setState({
            modal: true,
        });
    }

    handleModalCancel = (e) => {
        e.preventDefault();
        this.setState({
            modal: false,
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
            />
        ));
    }

    render() {
        const { className } = this.props;
        const { modal } = this.state;
        if (className === 'home') {
            return (
                <div>
                    <Title>
                        Homework Tracker
                    </Title>

                    <Button icon="plus" size="large" shape="round" onClick={this.handleClick}>New Assignment</Button>

                    <br />
                    <br />

                    <Row gutter={16}>
                        {this.renderClassBox()}
                    </Row>

                    <HWTrackModal
                        visible={modal}
                        onCancel={this.handleModalCancel}
                    />
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
