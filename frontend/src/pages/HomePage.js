import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const HomePage = () => {
  return (
    <Container>
      <Row className="mt-4">
        <Col>
          <h1>Welcome to the Boat Rental Portal</h1>
          <p>Select a basin on the map to get started.</p>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
