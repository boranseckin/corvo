import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { withAlert } from 'react-alert';
import propTypes from 'prop-types';

class UrlShortForm extends Component {
    static propTypes = {
        alert: propTypes.objectOf(propTypes.any),
    };

    static defaultProps = {
        alert: propTypes.objectOf(propTypes.any),
    };

    constructor(props) {
        super(props);

        this.state = {
            inputUrlValue: '',
            inputNameValue: '',
            inputDurationValue: '',
        };

        this.handleUrlChange = this.handleUrlChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleDurationChange = this.handleDurationChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleUrlChange(event) {
        this.setState({ inputUrlValue: event.target.value });
    }

    handleNameChange(event) {
        this.setState({ inputNameValue: event.target.value });
    }

    handleDurationChange(event) {
        this.setState({ inputDurationValue: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();

        const { alert } = this.props;
        const { inputNameValue, inputDurationValue } = this.state;
        let { inputUrlValue } = this.state;

        const regexp = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}|[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,})/;

        alert.remove(this.warn);

        if (!inputUrlValue) {
            this.warn = alert.info('URL is missing');
            return;
        }

        if (!regexp.test(inputUrlValue)) {
            this.warn = alert.info('URL is not valid');
            return;
        }

        if (!inputUrlValue.startsWith('http')) {
            inputUrlValue = `http://${inputUrlValue}`;
        }

        if (!inputNameValue) {
            this.warn = alert.info('Name is missing');
            return;
        }

        if (!inputDurationValue || inputDurationValue === 'Duration...') {
            this.warn = alert.info('Select a duration!');
            return;
        }

        Meteor.call('url.insert', inputUrlValue, inputNameValue, inputDurationValue);

        this.clearForm();
    }

    clearForm() {
        this.setState({
            inputUrlValue: '',
            inputNameValue: '',
        });
    }

    render() {
        const { inputUrlValue, inputNameValue } = this.state;
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <div className="row">
                        <div className="col-6">
                            <input type="text" className="form-control" placeholder="URL" value={inputUrlValue} onChange={this.handleUrlChange} />
                        </div>
                        <div className="col-3">
                            <input type="text" className="form-control" placeholder="Name" value={inputNameValue} onChange={this.handleNameChange} />
                        </div>
                        <div className="col-2">
                            <select name="duration" className="form-control" onChange={this.handleDurationChange}>
                                <option defaultValue>Duration...</option>
                                <option>1h</option>
                                <option>24h</option>
                                <option>Unlimited</option>
                            </select>
                        </div>
                        <div className="col-1">
                            <button id="url-add" type="submit" className="btn btn-success" onClick={this.handleSubmit}><i id="icon" className="material-icons">add</i></button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default withAlert()(UrlShortForm);
