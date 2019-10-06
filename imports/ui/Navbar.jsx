import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Tracker } from 'meteor/tracker';

import { Menu, Icon } from 'antd';

const { SubMenu } = Menu;

export default class Navbar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            current: FlowRouter.getRouteName(),
            user: null,
        };

        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        Tracker.autorun(() => {
            this.setState({
                user: Meteor.user(),
                current: FlowRouter.getRouteName(),
            });
        });
    }

    handleClick(e) {
        this.setState({ current: e.key });
    }

    render() {
        const { current, user } = this.state;
        if (user) {
            return (
                <div>
                    <Menu onClick={this.handleClick} selectedKeys={[current]} mode="horizontal" style={{ display: 'flex' }}>
                        <Menu.Item key="home">
                            <a href="/" style={{ textDecoration: 'none' }}>Home</a>
                        </Menu.Item>
                        <Menu.Item key="hw">
                            <a href="/hw" style={{ textDecoration: 'none' }}>HW Tracker</a>
                        </Menu.Item>
                        <Menu.Item key="url">
                            <a href="/url" style={{ textDecoration: 'none' }}>URL Shortener</a>
                        </Menu.Item>
                        <SubMenu
                            title={(
                                <span className="submenu-title-wrapper">
                                    <Icon type="user" />
                                    {user.username}
                                </span>
                            )}
                            style={{ marginLeft: 'auto' }}
                        >
                            <Menu.Item key="logout">
                                <a href="/logout" style={{ textDecoration: 'none' }}>
                                    <Icon type="logout" />
                                    Logout
                                </a>
                            </Menu.Item>
                        </SubMenu>
                    </Menu>
                </div>
            );
        }
        return (
            <div>
                <Menu onClick={this.handleClick} selectedKeys={[current]} mode="horizontal" style={{ display: 'flex' }}>
                    <Menu.Item key="home">
                        <a href="/" style={{ textDecoration: 'none' }}>Home</a>
                    </Menu.Item>
                    <Menu.Item key="hw">
                        <a href="/hw" style={{ textDecoration: 'none' }}>HW Tracker</a>
                    </Menu.Item>
                    <Menu.Item key="url">
                        <a href="/url" style={{ textDecoration: 'none' }}>URL Shortener</a>
                    </Menu.Item>
                    <Menu.Item key="signup" style={{ marginLeft: 'auto' }}>
                        <a href="/signup" style={{ textDecoration: 'none' }}>Sign up</a>
                    </Menu.Item>
                    <Menu.Item key="login">
                        <a href="/login" style={{ textDecoration: 'none' }}>Login</a>
                    </Menu.Item>
                </Menu>
            </div>
        );
    }
}
