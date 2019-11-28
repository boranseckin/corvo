import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Tracker } from 'meteor/tracker';
import { FlowRouter } from 'meteor/kadira:flow-router';
import moment from 'moment';

import {
    Table,
    Button,
    Divider,
    Popconfirm,
    Typography,
    Row,
    Col,
} from 'antd';

import URL from '../../api/url.db.js';
import UrlShortForm from './UrlShortForm.jsx';

const { Paragraph, Title } = Typography;

export default class UrlShort extends Component {
    static handleOpen(shortUrl, e) {
        e.preventDefault();
        FlowRouter.go(`/r/${shortUrl}`);
    }

    static handleRemove(id, e) {
        e.preventDefault();
        Meteor.call('url.remove', id);
    }

    constructor(props) {
        super(props);

        this.state = {
            urls: [],
            urlCount: 0,
            data: [],
            columns: [
                {
                    title: 'Name',
                    dataIndex: 'name',
                    key: 'name',
                },
                {
                    title: 'Shortened URL',
                    dataIndex: 'shortUrl',
                    key: 'shortUrl',
                },
                {
                    title: 'Actual URL',
                    dataIndex: 'actualUrl',
                    key: 'actualUrl',
                },
                {
                    title: 'Created At',
                    dataIndex: 'createdAt',
                    key: 'createdAt',
                },
                {
                    title: 'Duration',
                    dataIndex: 'duration',
                    key: 'duration',
                },
                {
                    title: 'Action',
                    key: 'action',
                    render: (text, record) => (
                        <span>
                            <Button type="primary" size="small" onClick={e => UrlShort.handleOpen(record.shortUrl, e)}>
                                <i className="material-icons">launch</i>
                            </Button>
                            <Divider type="vertical" />
                            <Popconfirm
                                title="Are you sure to delete this URL?"
                                onConfirm={e => UrlShort.handleRemove(record.key, e)}
                            >
                                <Button type="danger" size="small">
                                    <i className="material-icons">delete</i>
                                </Button>
                            </Popconfirm>
                        </span>
                    ),
                },
            ],
        };
    }

    componentDidMount() {
        Meteor.subscribe('urls');

        Tracker.autorun(() => {
            const query = URL.find({ userID: Meteor.userId() }).fetch();

            this.setState({
                urls: query,
                urlCount: query.length,
            }, () => this.mapURL());
        });
    }

    mapURL() {
        const { urls } = this.state;
        const array = [];

        urls.forEach((element) => {
            const date = moment(element.createdAt, 'dddd, MMMM Do YYYY, h:mm:ss a');

            const entry = {
                key: element._id,
                name: element.name,
                actualUrl: element.realUrl,
                shortUrl: element.shortUrl,
                duration: element.duration,
                createdAt: date.format('dddd, MMM Do YYYY, H:mm:ss'),
            };
            array.push(entry);
        });

        this.setState({
            data: array,
        });
    }

    render() {
        const { urlCount, columns, data } = this.state;
        return (
            <Row gutter={24}>
                <Col span={20} offset={2}>
                    <div>
                        <Title>
                            {`URL Shortener - ${urlCount}`}
                        </Title>
                        <Paragraph>
                            Create your shortened url! Then, use&nbsp;
                            <i>corvoapp.com/r/(Shortened URL)</i>
                            .
                        </Paragraph>
                        <UrlShortForm />
                        <br />
                        <Table columns={columns} dataSource={data} pagination={false} />
                    </div>
                </Col>
            </Row>
        );
    }
}
