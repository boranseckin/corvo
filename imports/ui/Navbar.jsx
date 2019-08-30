/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import propTypes from 'prop-types';

class Navbar extends Component {
    static propTypes = {
        currentPath: propTypes.string.isRequired,
    }

    constructor(props) {
        super(props);

        this.state = {
        };
    }

    render() {
        const { currentPath } = this.props;
        return (
            <div>
                <nav id="navbar" className="navbar navbar-expand-md navbar-light bg-white">
                    <ul className="navbar-nav mx-auto">
                        <li className="nav-item">
                            <a className="nav-link"><hr id="hr" width="75" /></a>
                        </li>
                        <li className={currentPath === '/' ? 'nav-item active' : 'nav-item'}>
                            <a className="nav-link" href="/">Home</a>
                        </li>
                        <li className={currentPath === '/url' ? 'nav-item active' : 'nav-item'}>
                            <a className="nav-link" href="/url">URL Shortener</a>
                        </li>
                        <li className={currentPath === '/hw' ? 'nav-item active' : 'nav-item'}>
                            <a className="nav-link" href="/hw">HW Tracker</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link"><hr id="hr" width="75" /></a>
                        </li>
                    </ul>
                </nav>
            </div>
        );
    }
}

export default withTracker(() => ({

}))(Navbar);
