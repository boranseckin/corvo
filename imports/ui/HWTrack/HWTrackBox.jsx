/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { withTracker } from 'meteor/react-meteor-data';
import propTypes from 'prop-types';
import {
    Card,
} from 'antd';

class HWTrackBox extends Component {
    static propTypes = {
        className: propTypes.string,
    };

    static defaultProps = {
        className: propTypes.string,
    };

    constructor(props) {
        super(props);

        this.state = {
            cardLoading: true,
        };

        this.handleCardClick = this.handleCardClick.bind(this);
    }

    componentDidMount() {
        this.setState({
            cardLoading: false,
        });
    }

    handleCardClick(event) {
        event.preventDefault();

        const { className } = this.props;

        FlowRouter.go(`/hw/${className}`);
    }

    render() {
        const { className } = this.props;
        const { cardLoading } = this.state;
        return (
            <div>
                <Card title={className} hoverable="true" loading={cardLoading} onClick={this.handleCardClick}>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Morbi auctor aliquam ipsum vel finibus.
                        Mauris egestas sit amet massa blandit sollicitudin.
                        Quisque ullamcorper diam hendrerit.
                    </p>
                </Card>
            </div>
        );
    }
}

export default withTracker(() => ({
}))(HWTrackBox);
