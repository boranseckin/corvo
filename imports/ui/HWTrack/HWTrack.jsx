import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import propTypes from 'prop-types';
import {
    Typography, Row, Col, Button,
} from 'antd';

import HWTrackBox from './HWTrackBox.jsx';

const { Title } = Typography;

class HWTrack extends Component {
    static propTypes = {
        className: propTypes.string,
    };

    static defaultProps = {
        className: propTypes.string,
    };

    constructor(props) {
        super(props);

        this.state = {
        };
    }

    render() {
        const { className } = this.props;
        if (className === 'home') {
            return (
                <div>
                    <Title>
                        Homework Tracker
                        <br />
                        {className}
                    </Title>
                    <Row gutter={16}>
                        <Col span={6}>
                            <HWTrackBox className="English" />
                        </Col>
                        <Col span={6}>
                            <HWTrackBox className="Math" />
                        </Col>
                        <Col span={6}>
                            <HWTrackBox className="Physics" />
                        </Col>
                        <Col span={6}>
                            <HWTrackBox className="CS" />
                        </Col>
                    </Row>
                </div>
            );
        }
        return (
            <div>
                <Title>
                    Homework Tracker
                    <br />
                    {className}
                </Title>
                <Button href="/hw">TEST</Button>
            </div>
        );
    }
}

export default withTracker(() => ({
}))(HWTrack);
