import React, { Component } from 'react';
import propTypes from 'prop-types';
import { positions, Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';

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

        const option = {
            position: positions.BOTTOM_CENTER,
            timeout: 3000,
        };

        return (
            <div>
                <center>
                    <Navbar />
                    <br />
                    <div>
                        <AlertProvider template={AlertTemplate} {...option}>
                            <div id="content">
                                {content}
                            </div>
                        </AlertProvider>
                    </div>

                </center>
            </div>
        );
    }
}
