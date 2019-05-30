import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/kadira:flow-router';
import propTypes from 'prop-types';

import Test from '../api/db.js';
import TestList from './TestList.jsx';

class Home extends Component {
    static propTypes = {
        tests: propTypes.arrayOf(propTypes.object),
        testCount: propTypes.number,
    };

    static defaultProps = {
        tests: propTypes.arrayOf(propTypes.object),
        testCount: propTypes.number,
    };

    constructor(props) {
        super(props);

        this.state = {
            inputValue: '',
            isToggled: true,
        };

        this.buttonClick = this.buttonClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    buttonClick(event) {
        event.preventDefault();

        const { isToggled } = this.state;

        this.setState({ isToggled: !isToggled });

        Meteor.call('test.clear');
    }

    handleChange(event) {
        const { value } = event.target;

        if (value !== 'test') {
            this.setState({ inputValue: event.target.value });
        } else {
            FlowRouter.go('/test');
        }
    }

    handleSubmit(event) {
        event.preventDefault();

        const { inputValue } = this.state;

        if (!inputValue) return;

        Meteor.call('test.insert', inputValue);
    }

    renderNumbers() {
        const { tests } = this.props;
        return tests.map(test => <TestList key={test._id} text={test.text} />);
    }

    render() {
        const { inputValue } = this.state;
        const { testCount } = this.props;
        return (
            <div>
                <h1>Home</h1>
                <button type="button" className="btn btn-primary" onClick={this.buttonClick}>
                    {'Clear - '}
                    {testCount}
                </button>
                <br />
                <h1>{inputValue}</h1>
                <br />
                <form onSubmit={this.handleSubmit}>
                    <input type="text" value={inputValue} onChange={this.handleChange} />
                    <br />
                </form>
                <br />
                <ul>{this.renderNumbers()}</ul>
            </div>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe('tests');
    return {
        tests: Test.find({}).fetch(),
        testCount: Test.find({}).count(),
    };
})(Home);
