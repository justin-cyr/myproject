import React from 'react';
import { Link } from 'react-router-dom';

import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

export default () => {
    const display = (
        <Container fluid>
            <Row>
                <Col><h1>My Project</h1></Col>
                <Col className="nav-link">
                    <Link to="/login">Login</Link>
                </Col>
                <Col className="nav-link">
                    <Link to="/signup">Create account</Link>
                </Col>
            </Row>
        </Container>
    );

    return (
        <header className="logged_out_nav_bar">
            {display}
        </header>
    );
};