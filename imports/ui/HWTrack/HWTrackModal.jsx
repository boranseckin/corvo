import React, { Component } from 'react';
import propTypes from 'prop-types';

import {
    Modal,
} from 'antd';

export default class HWTrackModal extends Component {
    static propTypes = {
        visible: propTypes.bool,
        onCancel: propTypes.func,
    };

    static defaultProps = {
        visible: propTypes.bool,
        onCancel: propTypes.func,
    };

    constructor(props) {
        super(props);

        this.state = {
        };
    }

    render() {
        const { visible, onCancel } = this.props;
        return (
            <Modal
                title="New Assignment"
                visible={visible}
                onCancel={onCancel}
                maskClosable={false}
                okText="Submit"
            >
                <p>TEst</p>
            </Modal>
        );
    }
}
