import React, { Component } from 'react';
import propTypes from 'prop-types';

export default class TestList extends Component {
    static propTypes = {
        text: propTypes.string,
    };

    static defaultProps = {
        text: propTypes.string,
    };

    constructor(props) {
        super(props);

        this.state = {
        };
    }

    render() {
        const { text } = this.props;
        return (
            <li>
                <span className="text">
                    {text}
                </span>
            </li>
        );
    }
}
