import React, { Component } from 'react';
import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    render() {
        return (
            <div>
                <Title>Welcome to Corvo</Title>
                <br />
                <Paragraph>
                    Corvo is a web application development playground
                     which is currenty developed by Boran Seckin.
                </Paragraph>
                <Paragraph>
                    The source code and the instructions can be found at
                    {' '}
                    <a href="https://github.com/boranseckin/corvo">GitHub</a>
                    .
                </Paragraph>
            </div>
        );
    }
}

export default Home;
