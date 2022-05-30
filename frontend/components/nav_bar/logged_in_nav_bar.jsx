import React from 'react';
import { Link } from 'react-router-dom';

import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

export default ({ user }) => {
    const display = (
        <Container fluid>
            <Row>
                <Col><h1>My Project</h1></Col>
                <Col className="nav-link">
                    {user.username}
                </Col>
                <Col className="nav-link">
                    <Link to="/logout">Logout</Link>
                </Col>
            </Row>
        </Container>
    );

    return (
        <header className="logged_in_nav_bar">
            {display}
        </header>
    );
};