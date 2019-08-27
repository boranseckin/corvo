/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

class HWTrack extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };

        this.handleRowExpand = this.handleRowExpand.bind(this);
    }

    handleRowExpand(e) {
        e.preventDefault();
        document.getElementById('button').click();
    }

    render() {
        return (
            <div className="container">
                <h1>Homework Tracker</h1>
                <a hidden className="btn btn-primary" id="button" data-toggle="collapse" href="#multiCollapseExample1" role="button" />
                <br />
                <table id="hw-table" className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Shortened URL</th>
                            <th scope="col">Actual URL</th>
                            <th scope="col">Created At</th>
                            <th scope="col">Duration</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr onClick={this.handleRowExpand}>
                            <th>
                                ELma
                                <div className="collapse multi-collapse" id="multiCollapseExample1">
                                    asda
                                </div>
                            </th>
                            <th>ELma</th>
                            <th>ELma</th>
                            <th>ELma</th>
                            <th>ELma</th>
                            <th>ELma</th>
                        </tr>
                        <tr>
                            <th>
                                ELma
                                <div className="collapse multi-collapse" id="multiCollapseExample2">
                                    asda
                                </div>
                            </th>
                            <th>ELma</th>
                            <th>ELma</th>
                            <th>ELma</th>
                            <th>ELma</th>
                            <th>ELma</th>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default withTracker(() => ({
}))(HWTrack);
