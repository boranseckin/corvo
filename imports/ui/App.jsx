import React, { Component } from 'react';
import propTypes from 'prop-types';

import Navbar from './Navbar.jsx';

export default class App extends Component {
    static propTypes = {
        content: propTypes.element,
    };

    static defaultProps = {
        content: propTypes.element,
    };

    constructor(props) {
        super(props);

        this.state = {
        };
    }

    render() {
        const { content } = this.props;

        return (
            <div>
                <center>
                    <Navbar />
                    <br />
                    <div id="content">
                        {content}
                    </div>
                </center>
            </div>
        );
    }
}
