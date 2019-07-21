import React from "react";
import { Col, Row, Container } from "../components/Grid";

function NoMatch() {
  return (
    <Container fluid>
      <Row>
        <Col size="md-12">
            <h1>404 Page Not Found</h1>
            <h1>
              <span role="img" aria-label="Face With Rolling Eyes Emoji">
                🙄
              </span>
            </h1>
            <a href="/">← Back To Login</a>
        </Col>
      </Row>
    </Container>
  );
}

export default NoMatch;
