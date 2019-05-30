import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

class RouteNotFound extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    render() {
        return (
            <div>
                <h1>Route Not Found!</h1>
            </div>
        );
    }
}

export default withTracker(() => ({

}))(RouteNotFound);
