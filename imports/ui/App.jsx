import React, { Component } from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
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
            <div className="container-fluid">
                <center>
                    <Navbar
                        currentPath={FlowRouter.current().route.path}
                    />

                    <div className="row justify-content-md-center">
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
