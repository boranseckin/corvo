import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Result } from 'antd';

class RouteNotFound extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    render() {
        return (
            <div>
                <Result
                    status="404"
                    title="404"
                    subTitle="Sorry, the page you visited does not exist."
                />
            </div>
        );
    }
}

export default withTracker(() => ({

}))(RouteNotFound);
