import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import propTypes from 'prop-types';

import URL from '../api/url.db.js';
import UrlShortRow from './UrlShortRow.jsx';
import UrlShortForm from './UrlShortForm.jsx';

class UrlShort extends Component {
    static propTypes = {
        urls: propTypes.arrayOf(propTypes.object),
        urlCount: propTypes.number,
    };

    static defaultProps = {
        urls: propTypes.arrayOf(propTypes.object),
        urlCount: propTypes.number,
    };

    constructor(props) {
        super(props);

        this.state = {

        };
    }

    renderUrls() {
        const { urls } = this.props;

        return urls.map(url => (
            <UrlShortRow
                key={url._id}
                _id={url._id}
                shortUrl={url.shortUrl}
                realUrl={url.realUrl}
                name={url.name}
                createdAt={url.createdAt}
                duration={url.duration}
            />
        ));
    }

    render() {
        const { urlCount } = this.props;
        return (
            <div className="container">
                <h1>
                    {'URL Shortener - '}
                    {urlCount}
                </h1>
                <br />
                <p>
                    Create your shortened url! Then use&nbsp;
                    <i>boranseckin.com/r/(Shortened URL)</i>
                    .
                </p>
                <UrlShortForm />
                <br />
                <table id="url-table" className="table table-hover">
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
                        {this.renderUrls()}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe('urls');
    return {
        urls: URL.find({}).fetch(),
        urlCount: URL.find({}).count(),
    };
})(UrlShort);
