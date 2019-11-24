import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import propTypes from 'prop-types';
import { Tracker } from 'meteor/tracker';

import { Layout } from 'antd';

import Navbar from './Navbar.jsx';

const { Footer } = Layout;

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
            version: null,
        };
    }

    componentDidMount() {
        const track = Tracker.autorun(() => {
            Meteor.call('CORVO_VERSION', (err, res) => {
                this.setState({
                    version: res,
                }, () => {
                    track.invalidate();
                });
            });
        });
    }

    render() {
        const { content } = this.props;
        const { version } = this.state;

        return (
            <div>
                <center>
                    <Navbar />
                    <br />
                    <div id="content">
                        {content}
                    </div>
                    <Footer style={{
                        textAlign: 'center',
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        padding: '15px 35px',
                        background: 'white',
                    }}
                    >
                        Corvo
                        {version ? ` ${version} ` : ' '}
                        || Boran Seckin
                    </Footer>
                </center>
            </div>
        );
    }
}
