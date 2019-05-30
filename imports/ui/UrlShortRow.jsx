/* eslint-disable jsx-a11y/anchor-is-valid */
import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import propTypes from 'prop-types';

export default class UrlShortRow extends Component {
    static propTypes = {
        _id: propTypes.string,
        shortUrl: propTypes.string,
        realUrl: propTypes.string,
        name: propTypes.string,
        createdAt: propTypes.instanceOf(Date),
        duration: propTypes.string,
    };

    static defaultProps = {
        _id: propTypes.string,
        shortUrl: propTypes.string,
        realUrl: propTypes.string,
        name: propTypes.string,
        createdAt: propTypes.instanceOf(Date),
        duration: propTypes.string,
    };

    constructor(props) {
        super(props);

        this.handleRemove = this.handleRemove.bind(this);
        this.handleCopy = this.handleCopy.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
    }

    handleRemove(event) {
        event.preventDefault();

        const { _id } = this.props;

        Meteor.call('url.remove', _id);
    }

    handleCopy(event) {
        event.preventDefault();

        const { shortUrl } = this.props;
        const textarea = document.createElement('textarea');

        textarea.value = `http://localhost:3000/r/${shortUrl}`;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }

    handleOpen(event) {
        event.preventDefault();

        const { shortUrl } = this.props;

        const dynamicLink = `http://localhost:3000/r/${shortUrl}`;

        window.open(dynamicLink);
    }

    render() {
        const {
            shortUrl,
            realUrl,
            name,
            createdAt,
            duration,
        } = this.props;

        let newRealUrl;

        if (realUrl.length > 38) {
            newRealUrl = realUrl.slice(0, 36);
            newRealUrl += '...';
        } else {
            newRealUrl = realUrl;
        }

        return (
            <tr id="url-table">
                <td>{name}</td>
                <td>
                    {shortUrl}
                </td>
                <td><a href={realUrl} data-toggle="tooltip" title={realUrl}>{newRealUrl}</a></td>
                <td>
                    {createdAt.toLocaleDateString()}
                    &nbsp;
                    {createdAt.toLocaleTimeString()}
                </td>
                <td>{duration}</td>
                <td>
                    <button id="url-edit" type="button" className="btn btn-primary" onClick={this.handleOpen}><i id="icon" className="material-icons">launch</i></button>
                    <button id="url-remove" type="button" className="btn btn-danger" onClick={this.handleRemove}><i id="icon" className="material-icons">delete</i></button>
                </td>
            </tr>
        );
    }
}
